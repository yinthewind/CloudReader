var $ = require('jquery');
var PDFJS = require('pdfjs-dist');
var React = require('react');
var MenuBar = require('./MenuBar');
var PdfPage = require('./PdfPage');
require('./Viewer.css');

module.exports = React.createClass({

	fileId: null,
	commentId: null,
	pageIndex: 0,
	pageOffsets: [],
	phase: 0,
	requestExecutor: null,

	componentDidMount: function() {
		this.getMetadata();
	},

	getInitialState: function() {

		window.addEventListener('scroll', this.scrollListener);

		PDFJS.disableWorker = true;   
		var url = this.props.url;
		this.fileId = this.props.fileId;
		this.pageIndex = this.props.initialPageIndex || 0;
		this.requestExecutor = this.props.sendMessage;
		var doc = PDFJS.getDocument(url);

		var that = this;
		doc.then(function(pdfDoc) {
			var pages = [];
			for(var i = 1; i <= pdfDoc.numPages; i++) {
				pages.push(pdfDoc.getPage(i));
			}
			console.log('pages downloaded: ' + pages);
			that.updatePhase(that.phase | 2);
			that.setState(Object.assign({}, that.state, { pages: pages }));
		});

		return { 
			pages: [],
			scale: 1
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

		var pages = null;
		var that = this;
		if(this.phase < 3) {
			return <div className='loader'/>
		} 

		var pageOffsets = this.pageOffsets;
		pages = this.state.pages.map(function(page, idx) {
			return <PdfPage data={page} scale={that.state.scale}
				onFinish={function(top) {
					pageOffsets[idx + 1]=top;
					if(idx+1 === that.state.pages.length) {
						that.updatePhase(that.phase | 4);
					}
				}}
				ref={idx}
			/>
		})

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
					<div className='pages-container'>
						{ pages }
					</div>
				</div>)
	},

	scrollToPage: function(pageIndex) {
		var pos = this.pageOffsets[pageIndex];
		if(pos) {
			window.scrollTo(0, pos);
		}
		this.updatePhase(this.phase | 8);
	},

	lastScrollTop: 0,

	scrollListener: function() { 
		var scrollTop = $(window).scrollTop();
		if(Math.abs(scrollTop - this.lastScrollTop) < 47) {
			return;
		}

		this.lastScrollTop = scrollTop;

		var start = 0, end = this.pageOffsets.length - 1;
		while(start + 1 < end) {
			var tmp = start + end;
			var mid = (tmp - tmp % 2) / 2;
			if(this.pageOffsets[mid] >= scrollTop) {
				end = mid;
			} else if(this.pageOffsets[mid] < scrollTop) {
				start = mid;
			}
		}
		this.pageIndex = start;

		this.refs[this.pageIndex].renderPageContentAsync();
		console.log(this.pageIndex);
	},

	executeRequest: function(data, callback) {
		if(this.requestExecutor) {
			this.requestExecutor(data, callback);
		} else {
			console.log('invalid requestExecutor');
		}
	},

	getMetadata: function() {
		var that = this;
		this.executeRequest(
			{ type: 'getMetadata', fileId: this.fileId },
			function(response) {
				var scale = 1.5;
				if(response) {
					that.commentId = response.id;
					that.pageIndex = response.pageIndex;
					scale = response.scale;
				}
				that.updatePhase(that.phase | 1);
				console.log('get metadata...'); 
				console.log(response);
				that.setState(
					Object.assign({}, that.state, {scale: scale})
				);
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
		this.executeRequest(request);
		console.log('uploading metadata...');
		console.log(data);
	},

	updatePhase: function(newPhase) {
		console.log('phase: ' + this.phase + '->' + newPhase);
		this.phase = newPhase;
		if(newPhase === 7) {
			this.scrollToPage(this.pageIndex);
		} else if(newPhase === 15) {
			var that = this;
			var handler = function() {
				that.uploadMetadata();
			}
			setInterval(handler, 10000);
		}
	}
});
