var baseUrl = "https://www.googleapis.com/drive/v3";

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {

		var that = this;
		request.callback = function(error, status, response) {
			if(status !== 200) {
				sendResponse({ files: [{name:"failed", id: "..."}] });
			} else {
				sendResponse(response);
			}
		}

		processor(request);

		return true; // indicate async sendResponse
	}
);

function processor(request) {
	switch(request.type) {
		case 'listPdf':
			listPdf(request);
			break;
		case 'getPdf':
			getPdf(request);
			break;
		default:
	}
}

function getPdf(request) {
	xhrWithAuth(
		'GET',
		baseUrl + "/files/fileId/" + request.fileId 
		+ "?fields=webContentLink%2CwebViewLink",
		true,
		request.callback
	);
}

function listPdf(request) {
	xhrWithAuth(
		'GET',
		baseUrl + "/files?q=mimeType%3D'application/pdf'",
		true,
		request.callback
	);
}

function xhrWithAuth(method, url, interactive, callback) {
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
		xhr.send();
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
