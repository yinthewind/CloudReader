'use strict'

var React = require('react');
var PDFJS = require('pdfjs-dist');

module.exports = React.createClass({
	render: function() {
		var url = this.props.url;
		var container = this.props.container;

		renderPdf(url, container);
	}
});
function renderPdf(url, container) {

	function renderPage(page) {
		var scale = 1.5;
		var viewport = page.getViewport(scale);

		var canvas = document.createElement('canvas');
		canvas.style.display = 'block';
		canvas.style.margin = 'auto';
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
		}
	}

	PDFJS.disableWorker = true;
	PDFJS.getDocument(url).then(renderPages);
}
