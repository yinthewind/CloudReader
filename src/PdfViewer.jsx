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

	phase: 0,
	children: [],
	requestExecutor: null,
	phases: {
		metadataDownloaded: 1,
		pageDataDownloaded: 2,
		pagePlaceHolderRendered: 4,
		pageIndexesRecorded: 8,
		initialScrolled: 16
	},

	componentWillMount: function() {
		this.getMetadata();
	},

	getInitialState: function() {

		window.addEventListener('scroll', this.scrollListener);

		PDFJS.disableWorker = true;   
		this.fileId = this.props.fileId;
		this.pageIndex = this.props.initialPageIndex || 0;
		this.requestExecutor = this.props.sendMessage;
		var doc = PDFJS.getDocument(this.props.url);

		var that = this;
		doc.then(function(pdfDoc) {
			var promises = [];
			for(var i = 1; i <= pdfDoc.numPages; i++) {
				promises[i-1]=pdfDoc.getPage(i);
			}
			Promise.all(promises).then((values)=>{
				that.updatePhase(that.phase | that.phases.pageDataDownloaded);
				that.setState(Object.assign({}, that.state, { pages: values }));
			});
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

		var n = this.state.pages.length;
		var children = this.children;
		var that = this;
		pages = this.state.pages.map(function(page, idx) {
			return <PdfPage 
						page={page} 
						scale={that.state.scale} 
						onPlaceHolderRendered={function() {
							if(--n == 0) {
								that.updatePhase(that.phase |= that.phases.pagePlaceHolderRendered);
							}
						}}
						ref={function(page) {
							children[idx] = page;
						}}
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
		var pos = this.children[pageIndex].getOffsetTop();
		if(pos) {
			window.scrollTo(0, pos);
		}
		this.updatePhase(this.phase | this.phases.pageIndexesRecorded);
	},

	getViewablePages: function() {
		
		var scrollTop = $(window).scrollTop();
		var viewablePages = [];

		var start = 0, end = this.children.length - 1;
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

	lastScrollTop: 0,

	scrollListener: function() { 
		var scrollTop = $(window).scrollTop();
		if(Math.abs(scrollTop - this.lastScrollTop) < 47) {
			return;
		}
		this.lastScrollTop = scrollTop;

		var viewablePages = this.getViewablePages();
		this.pageIndex = viewablePages[0];
		console.log(this.pageIndex);

		this.renderPagesContent(viewablePages);
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
				that.updatePhase(that.phase | that.phases.metadataDownloaded);
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

			var pages = this.getViewablePages();
			this.renderPagesContent(pages);
		}
	}
});
