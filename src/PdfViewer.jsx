var $ = require('jquery');
var PDFJS = require('pdfjs-dist');
var React = require('react');
var MenuBar = require('./MenuBar');
var Page = require('./Page');

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

		var that = this;
		doc.then(function(pdfDoc) {
			var pages = [];
			for(var i = 1; i < pdfDoc.numPages; i++) {
				pages.push(pdfDoc.getPage(i));
			}
			console.log(pages);
			that.setState({pages: pages});
		});

		return { 
			pages: [] 
		}
	},

	render: function() {

		if(this.props.url == null) return null;

		var pageOffsets = this.pageOffsets;

		return (<div> 
					<MenuBar items={['+', '-']}/>
					{ 
						this.state.pages.map(function(page, idx) {
							return <Page 
										src={page} 
										onFinish={function(top) {
											pageOffsets[idx]=top;
										}}
									/>
						})
					}
				</div>)
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
	}
});
