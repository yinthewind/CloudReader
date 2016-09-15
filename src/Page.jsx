var React = require('react');
var $ = require('jquery');

module.exports = React.createClass({

	render: function() {
		var page = this.props.src;
		var renderPage = this.renderPage;
		var onFinish = this.props.onFinish;
		return <canvas ref={function(c) { 
			page.then(function(p) {renderPage(p,c,onFinish)})} 
		}/>
	},

	renderPage: function(page, canvas, onFinish) {
		var scale = 2;
		var viewport = page.getViewport(scale);

		canvas.style.display = 'block';
		canvas.style.margin = 'auto';
		var context = canvas.getContext('2d');
		canvas.height = viewport.height;
		canvas.width = viewport.width;

		var renderContext = {
			canvasContext: context,
			viewport: viewport
		};

		page.render(renderContext);
		var o = $(canvas).offset().top;
		onFinish(o);
	}           
})
