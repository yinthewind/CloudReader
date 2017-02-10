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

		var p = this.xhr(method, url, null);

		return p.then(data => {
			return JSON.parse(data).files;
		});
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
				reject(error, status, response);
			} else {
				resolve(response);
			}
		}

		function getToken() {
			chrome.identity.getAuthToken(
				{ interactive: true }, // what value should I use??? 
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
