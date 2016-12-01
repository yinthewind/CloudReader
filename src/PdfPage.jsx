var React = require('react');
var $ = require('jquery');

module.exports = React.createClass({

	canvas: null,
	contentRendered: null,

	render: function() {
		var that = this;
		var viewport = this.props.page.getViewport(this.props.scale);
		return <canvas 
					className='pdf-page' 
					height={viewport.height}
					width={viewport.width}
					ref={function(c) { 
						that.canvas = c; 
						if(c&&that.props.onPlaceHolderRendered) {
							that.props.onPlaceHolderRendered();
						}
						that.contentRendered = false;
					}}
				/>
	},

	getOffsetTop: function() {
		return this.canvas.offsetTop;
	},

	renderPageContent: function() {
		if(this.contentRendered) {
			return;
		}
		var scale = this.props.scale || 1.5;

		if(!this.canvas) return null;

		var viewport = this.props.page.getViewport(scale);
		var context = this.canvas.getContext('2d');

		var renderContext = {
			canvasContext: context,
			viewport: viewport
		};

		this.props.page.render(renderContext);
		this.contentRendered = true;
	}
})
