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
	synced: false,

	componentDidMount: function() {
		this.getMetadata();

		var that = this;
		var handler = function() {
			if(that.synced) that.uploadMetadata();
		}
		setInterval(handler, 10000);
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
			pages: [],
			scale: 1.5
		}
	},

	increaseScale: function() {
		var newScale = this.state.scale + 0.25;
		this.setState(Object.assign({}, this.state, {scale: newScale}));
	},

	decreaseScale: function() {
		var newScale = this.state.scale - 0.25;
		this.setState(Object.assign({}, this.state, {scale: newScale}));
	},

	render: function() {

		if(this.props.url == null) return null;

		var pageOffsets = this.pageOffsets;
		var that = this;

		return (<div> 
					<MenuBar items={[
						{ 
							text: '+', 
							onClick: this.increaseScale
						}, 
						{ 
							text: '-', 
							onClick: this.decreaseScale
						}
					]}/>
					{ 
						this.state.pages.map(function(page, idx) {
							return <Page 
										src={page} 
										scale={that.state.scale}
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
	},

	getMetadata: function() {
		var that = this;
		chrome.runtime.sendMessage(
			{ type: 'getMetadata', fileId: this.fileId },
			function(response) {
				if(response == null) return;
				if(that.pageIndex < response.pageIndex) {
					that.pageIndex = response.pageIndex;
					that.scrollToPage(that.pageIndex);
				}
				that.commentId = response.id;
				console.log('get metadata...'); 
				console.log(response);
				that.synced = true;
			}
		);
	},

	uploadMetadata: function() {
		var data = { 
			version: 1,
			pageIndex: this.pageIndex,
			scale: this.state.scale 
		};
		var request = {
			type: 'uploadMetadata',
			fileId: this.fileId,
			commentId: this.commentId,
			data: data
		};
		chrome.runtime.sendMessage(request);
		console.log('uploading metadata...');
		console.log(data);
	}
});
