var Viewer = require('./Viewer');

document.addEventListener('DOMContentLoaded', function() {

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if(request.type == 'openPdf') {
				renderPdf(
					request.bookUrl, document.getElementById('container'));
			}
		}
	);
});

