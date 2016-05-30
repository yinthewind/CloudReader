chrome.extension.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(msg) {
		
	xhrWithAuth(
		'GET',
		"https://www.googleapis.com/drive/v3/files?q=mimeType%3D'application/pdf'",
		true,
		function(error, status, response) {
			
			if(status != 200) port.postMessage(status);
			else port.postMessage(response);
		});
		
	});
});

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
