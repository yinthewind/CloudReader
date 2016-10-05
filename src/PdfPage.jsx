var React = require('react');
var $ = require('jquery');

module.exports = React.createClass({

	scale: null,
	canvas: null,
	pagePromise: null,

	componentWillMount: function() {
		this.pagePromise = this.props.data;
		this.scale = this.props.scale || 1.5;
	},

	render: function() {
		var that = this;
		return <canvas ref={function(c) { 
			that.canvas = c;
			that.pagePromise.then(function(p) {
				that.renderPlaceholder(p, that.props.onFinish)}
			);
		}}/>
	},

	renderPlaceholder: function(page, onFinish) {
		var canvas = this.canvas;
		var scale = this.scale;

		canvas.style.display = 'block';
		canvas.style.margin = 'auto';
		canvas.style.marginBottom = '4px';
		canvas.style.backgroundColor = 'white';

		var viewport = page.getViewport(scale);
		canvas.height = viewport.height;
		canvas.width = viewport.width;

		var o = $(canvas).offset().top;
		onFinish(o);
	},

	renderPageContentAsync: function() {
		var pagePromise = this.pagePromise;
		var canvas = this.canvas;
		var renderPageContent = this.renderPageContent;
		pagePromise.then(function(p) {renderPageContent(p,canvas)});
	},

	renderPageContent: function(page, canvas) {
		if(!canvas) return null;
		var scale = this.scale;

		var viewport = page.getViewport(scale);
		var context = canvas.getContext('2d');

		var renderContext = {
			canvasContext: context,
			viewport: viewport
		};

		page.render(renderContext);
	}           
})