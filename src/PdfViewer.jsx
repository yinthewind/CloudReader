var $ = require('jquery');
var PDFJS = require('pdfjs-dist');
var React = require('react');
var MenuBar = require('./MenuBar');
var PdfPage = require('./PdfPage');
require('./Viewer.css');

module.exports = React.createClass({

	children: [],

	componentWillMount: function() {
		window.addEventListener('scroll', this.scrollListener);
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		if(nextProps.scale===this.props.scale && nextProps.pages===this.props.pages) {
			return false;
		}
		return true;
	},

	render: function() {

		var n = this.props.pages.length;
		var that = this;
		var pages = this.props.pages.map(function(page, idx) {
			return <PdfPage 
						page={page} 
						scale={that.props.scale} 
						ref={function(page) {
							that.children[idx] = page;
							if(--n == 0) {
								that.scrollToPage(that.props.pageIndex);
							}
						}}
					/>
		})

		return <div className='pages-container'> 
					{ pages }
				</div>
	},

	scrollToPage: function(pageIndex) {
		var pos = this.children[pageIndex].getOffsetTop();
		if(pos) {
			window.scrollTo(0, pos);
		}
		var pages = this.getViewablePages();
		this.renderPagesContent(pages);
	},

	getViewablePages: function() {
		
		var scrollTop = $(window).scrollTop();
		var viewablePages = [];

		var start = 0, end = this.children.length;
		while(start + 1 < end) {
			var tmp = start + end;
			var mid = (tmp - tmp % 2) / 2;
			if(this.children[mid].getOffsetTop() >= scrollTop) {
				end = mid;
			} else if(this.children[mid].getOffsetTop() < scrollTop) {
				start = mid;
			}
		}

		var scrollBottom = scrollTop + window.innerHeight;
		for(var i=start;i<this.children.length&&this.children[i].getOffsetTop()<scrollBottom;i++) {
			viewablePages.push(i);
		}

		return viewablePages;
	},

	renderPagesContent: function(pages) {
		for(var i=0;i<pages.length;i++) {
			this.children[pages[i]].renderPageContent();
			console.log('triggering content rendering for page ' + pages[i]);
		}
	},

	pageIndex: 0,
	lastScrollTop: 0,

	scrollListener: function() { 
		var scrollTop = $(window).scrollTop();
		if(Math.abs(scrollTop - this.lastScrollTop) < 47) {
			return;
		}
		this.lastScrollTop = scrollTop;

		var viewablePages = this.getViewablePages();
		if(this.pageIndex != viewablePages[0]) {
			this.pageIndex = viewablePages[0];
			if(this.props.updatePageIndex) {
				this.props.updatePageIndex(this.pageIndex);
			}
		}
		this.renderPagesContent(viewablePages);
	},
});
