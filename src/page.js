'use strict'

var PDFJS = require('pdfjs-dist');

function renderPdf(url, container) {

	function renderPage(page) {
		var scale = 1.5;
		var viewport = page.getViewport(scale);

		var canvas = document.createElement('canvas');
		canvas.style.display = "block";
		var context = canvas.getContext('2d');
		canvas.height = viewport.height;
		canvas.width = viewport.width;

		var renderContext = {
			canvasContext: context,
			viewport: viewport
		};

		container.appendChild(canvas);
		page.render(renderContext);
	}

	function renderPages(pdfDoc) {
		for(var num = 1; num <= pdfDoc.numPages; num++) {
			pdfDoc.getPage(num).then(renderPage);
			console.log(num);
		}
	}

	PDFJS.disableWorker = true;
	PDFJS.getDocument(url).then(renderPages);
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(request.type);
		if(request.type == 'openPdf') {
			renderPdf(request.bookUrl, document.getElementById('container'));
		}
	}
);
