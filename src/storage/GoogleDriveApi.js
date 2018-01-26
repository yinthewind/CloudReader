export default class GoogleDriveApi {
	constructor(xhr = XhrWithAuth) {
		this.name = "GoogleDriveApi";
		this.baseUrl = 'https://www.googleapis.com/drive/v3';
		this.xhr = xhr;
	}

	buildUrl(type, queries) {
		var url = this.baseUrl + type;

		if(queries) {
			url += '?' +  queries.join('&');
		}
		return url;
	}

	listFile() {
		var method = 'GET';
		var url = this.buildUrl('/files', [
			'q=' + encodeURIComponent('mimeType=\'application/pdf\''),
			'fields=' + encodeURIComponent('files(id,name,webContentLink)'),
		]);

		return this.xhr(method, url, null).then(data => {
			return JSON.parse(data).files;
		});
	}

	getMeta(fileId) {
		var method = 'GET';
		var url = this.buildUrl('/files/' + fileId + '/comments', [
			'fields=' + encodeURIComponent('comments')
		]);

		return this.xhr(method, url, null).then(data => {
			var comment = JSON.parse(data).comments
				.find(comment => comment.content.startsWith('CloudReaderMetaData'));

			if(!comment) return null;
			var index = comment.content.indexOf('{');
			var data = null;
			if(index != -1) {
				data = comment.content.substring(index);
			}
			return Object.assign({id: comment.id}, JSON.parse(data));
		});
	}

	putMeta(id, data) {
		var content = { content: 'CloudReaderMetaData:' + JSON.stringify(data) };
		var fileId = id.fileId;
		var commentId = id.commentId;
		var method;
		var url;

		if(commentId) {
			method = 'PATCH';
			url = this.buildUrl('/files/' + fileId + '/comments/' + commentId, [
				'fields=' + encodeURIComponent('content')
			]);
		} else {
			method = 'POST';
			url = this.buildUrl('/files/' + fileId + '/comments', [
				'fields=' + encodeURIComponent('content')
			]);
		}

		return this.xhr(method, url, content);
	}
}

function XhrWithAuth(method, url, data) {
	var accessToken;
	var retry = true;

	return new Promise((resolve, reject) => {
		
		getToken();
		function callback(error, status, response) {
			if(error) {
				console.log(error);
				console.log(status);
				console.log(response);
				reject(error);
			} else {
				resolve(response);
			}
		}

		function getToken() {
			chrome.identity.getAuthToken(
				{ interactive: true },
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
	});
}
