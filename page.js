'use strict'

var url = 'helloworld.pdf';

var PDFJS = require('pdfjs-dist');

global.PDFJS.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.js';

PDFJS.getDocument(url).then(function(pdf) {
	pdf.getPage(1).then(function(page) {
		var scale = 1.5;
		var viewport = page.getViewport(scale);

		var canvas = document.getElementById('container');
		var context = canvas.getContext('2d');
		canvas.height = viewport.height;
		canvas.width = viewport.width;

		var renderContext = {
			canvasContext: context,
			viewport: viewport
		};
		page.render(renderContext);
	});
});
