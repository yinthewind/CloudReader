var PDFJS = require('pdfjs-dist');
var React = require('react');


module.exports = React.createClass({

getInitialState: function() {
		return { url: this.props.url }
	},

	render: function() {

		if(this.state.url == null) return null;
		
		return <div> { renderPdf(this.state.url, 'pdfContainer') }</div>
	}
});

function renderPdf(url) {

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

		var container = document.getElementById('pdfContainer');
		container.appendChild(canvas);
		page.render(renderContext);
	}

	function renderPages(pdfDoc) {
		for(var num = 1; num <= pdfDoc.numPages; num++) {
			pdfDoc.getPage(num).then(renderPage);
		} 
	}

	var pdfContainer = <div id="pdfContainer" />;

	PDFJS.disableWorker = true;   
	PDFJS.getDocument(url).then(renderPages);

	return pdfContainer;
}

