var $ = require('jquery');
var PDFJS = require('pdfjs-dist');
var React = require('react');


module.exports = React.createClass({

	fileId: null,
	commentId: null,
	pageIndex: 0,
	pageOffsets: [],

	componentDidMount: function() {
		if(this.props.syncHandler) {
			var that = this;
			var handler = function() {
				if(that.props.syncHandler) {
					that.props.syncHandler(
						that.fileId, 
						that.commentId, 
						that.pageIndex, 
						that.scrollToPage
					);
				}
			}
			setInterval(handler, 20000);
		}
	},

	getInitialState: function() {

		window.addEventListener('scroll', this.scrollListener);

		PDFJS.disableWorker = true;   
		var url = this.props.url;
		this.fileId = this.props.fileId;
		this.pageIndex = this.props.initialPageIndex || 0;
		var doc = PDFJS.getDocument(url);

		return { 
			doc: doc
		}
	},

	render: function() {

		if(this.props.url == null) return null;

		return <div> { this.renderPdf(this.state.doc) }</div>
	},

	scrollToPage: function(pageIndex) {
		var pos = this.pageOffsets[pageIndex];
		if(pos) {
			window.scrollTo(0, pos);
		}
	},

	scrollListener: function() { 
		var scrollTop = $(window).scrollTop();
		if(this.pageOffsets[this.pageIndex] < scrollTop) this.pageIndex++;
		console.log(this.pageIndex);
	},

	renderPdf: function(doc) {

		var that = this;

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

			that.pageOffsets.push($(canvas).offset().top);
		}

		function renderPages(pdfDoc) {
			for(var num = 1; num <= pdfDoc.numPages; num++) {
				pdfDoc.getPage(num).then(renderPage);
			} 
		}

		var pdfContainer = <div id="pdfContainer" />;
		doc.then(renderPages);

		return pdfContainer;
	}
});
