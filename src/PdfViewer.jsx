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
	sendMessage: null,

	componentDidMount: function() {
		if(this.props.sendMessage) {
			this.sendMessage = this.props.sendMessage;
			var that = this;
			var handler = function() {
				that.syncProgress(that.fileId, that.commentId, that.pageIndex);
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


	syncProgress: function(fileId, commentId, currentIndex) {
		
		var that = this;
		var commendId = null;
		var cloudIndex = null;
		this.sendMessage(
			{ type: 'getProgress', fileId: fileId }, 
			function(response) {
				if(response != null) {
					cloudIndex ==response.content.split(':').pop();
					commentId = response.id;
					if(cloudIndex > currentIndex) {
						that.scrollToPage(cloudIndex);
					}
				console.log('cloud: ' + cloudIndex + '#current: ' + currentIndex);
			}

			if(cloudIndex == null || cloudIndex < currentIndex) {
				var request = {
					type: 'uploadProgress',
					fileId: fileId,
					commentId: commentId,
					data: { content: 'CloudReaderProgress:' +  currentIndex }
				};
			
				that.sendMessage(request);
				console.log('uploading');
			}
		});
	},

	getProgress: function(fileId, currentIndex) {
		chrome.runtime.sendMessage(
			{ type: 'getProgress', fileId: fileId },
			function(response) {
				if(response == null) return;
				cloudIndex = response.content.split(':').pop();
				commentId = response.id;
				console.log('get progress: ' + cloudIndex); 
			}
		);
	},

	uploadProgress: function(fileId, commentId, currentIndex) {
		var request = {
			type: 'uploadProgress',
			fileId: fileId,
			commentId: commentId,
			data: { content: 'CloudReaderProgress:' + currentIndex }
		};
		chrome.runtime.sendMessage(request);
		console.log('uploading');
	}
});
