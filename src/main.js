var baseUrl = "https://www.googleapis.com/drive/v3";

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {

		request.sendResponse = sendResponse;
		processor(request);

		return true; // indicate async sendResponse
	}
);

function processor(request) {
	switch(request.type) {
		case 'listPdf':
			listFile(request);
			break;
		case 'openPdf':
			openPdf(request);
			break;
		case 'uploadMetadata':
			uploadMetadata(request);
			break;
		case 'getMetadata':
			getMetadata(request);
			break;
		default:
	}
}

function openPdf(request) {
	
	chrome.tabs.create({url: 'page.html'}, function(tab) {

		getFileUrl(request, function(error, status, response) {
			var data = JSON.parse(response);

			chrome.tabs.sendMessage(tab.id, 
				{ type: 'openPdf', fileId: data.id, bookUrl: data.webContentLink });
		});
	});
}

function getFileUrl(request, callback) {
	var fileId = request.fileId;

	xhrWithAuth(
		'GET',
		baseUrl + "/files/" + fileId + "?fields=webContentLink%2Cid",
		null,
		true,
		callback
	);
}

function listFile(request) {
	var fileType = request.mimeType || "'application/pdf'";

	xhrWithAuth(
		'GET',
		baseUrl + "/files?q=mimeType%3D" + fileType,
		null,
		true,
		function(error, status, response) {
			request.sendResponse(response);
		}
	);
}

function getMetadata(request) {

	var fileId = request.fileId;

	xhrWithAuth(
		'GET',
		baseUrl + '/files/' + fileId + '/comments?fields=comments',
		null,
		true,
		function(error, status, response) {
			if(response == null || status == 404) {
				request.sendResponse({});
				return;
			}

			var data = JSON.parse(response);
			data.comments.forEach(function(value) {
				if(value.content.startsWith('CloudReaderMetaData')) {
					var index = value.content.indexOf('{');
					var metaData = null;
					if(index != -1) {
						metaData = value.content.substring(index);
					}
					var result = Object.assign({id: value.id}, JSON.parse(metaData));
					request.sendResponse(result);
					return;
				}
			});
			request.sendResponse(null);
		}
	);
}

function uploadMetadata(request) {

	var fileId = request.fileId;
	var commentId = request.commentId;
	var data = { content: 'CloudReaderMetaData:' + JSON.stringify(request.data) };

	if(commentId) {
		xhrWithAuth(
			'PATCH',
			baseUrl + '/files/' + fileId + '/comments/' + commentId + '?fields=content',
			data,
			true,
			function() {}
		);
	} else {
		xhrWithAuth(
			'POST',
			baseUrl + '/files/' + fileId + '/comments?fields=content',
			data,
			true,
			function() {}
		);
	}
}

function xhrWithAuth(method, url, data, interactive, callback) {
	var accessToken;
	var retry = true;

	getToken();
	function getToken() {
		chrome.identity.getAuthToken(
			{ interactive: interactive }, 
			function(token) {
				if(chrome.runtime.lastError) {
					callback(chrome.runtime.lastError);
					return;
				}

				accessToken = token;
				requestStart();
			}
		);
	}

	function requestStart() {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
		xhr.onload = requestComplete;
		if(data) {
			xhr.setRequestHeader('Content-Type', 'application/json');
		}

		xhr.send(JSON.stringify(data));
	}

	function requestComplete() {
		if(this.status == 401 && retry) {
			retry = false;
			chrome.identity.removeCachedAuthToken(
				{ token: accessToken },
				getToken);
		} else {
			callback(null, this.status, this.response);
		}
	}
}
