var $ = require('jquery');
var PDFJS = require('pdfjs-dist');
var React = require('react');
var MenuBar = require('./MenuBar');
var PdfPage = require('./PdfPage');
var PdfViewer = require('./PdfViewer');
require('./Viewer.css');

module.exports = React.createClass({

	phase: 0,
	requestExecutor: null,
	needUploadMetadata: false,
	phases: {
		metadataDownloaded: 1,
		pageDataDownloaded: 2,
		pagePlaceHolderRendered: 4
	},

	componentWillMount: function() {
		var metadataPromise = this.props.requestExecutor.getMetadata();
		var that = this;
		metadataPromise.then((metadata)=>{
			that.metadata=metadata;
			console.log(metadata);
			that.updatePhase(that.phase | that.phases.metadataDownloaded);
			that.setState(
				Object.assign({}, that.state, {
					scale: metadata.scale,
					pageIndex: metadata.pageIndex
				})
			);
		});
		
		var handler = function() {
			if(!that.needUploadMetadata) {
				return;
			}
			that.needUploadMetadata = false;

			that.props.requestExecutor.uploadMetadata({
				pageIndex: that.state.pageIndex,
				scale: that.state.scale
			});
		}
		setInterval(handler, 3000);
	},

	getInitialState: function() {

		var pagesPromise = this.props.requestExecutor.getPages();
		var that = this;
		pagesPromise.then((value)=>{
			that.updatePhase(that.phase | that.phases.pageDataDownloaded);
			that.setState(Object.assign({}, that.state, { pages: value }));
		});

		return { 
			pages: [],
			pageIndex: 0,
			scale: 1
		}
	},

	render: function() {

		if(this.phase < 3) {
			return <div className='loader'/>
		} 

		var that = this;
		return (<div> 
					<MenuBar 
						increaseHandler={function() {
							var newScale = that.state.scale + 0.25;
							that.setState(
								Object.assign({}, that.state, {scale: newScale})
							);
						}}
						decreaseHandler={function() {
							var newScale = that.state.scale - 0.25;
							that.setState(
								Object.assign({}, that.state, {scale: newScale})
							);
						}}
						pageNum={this.state.pages.length}
						currentPageIndex={this.state.pageIndex + 1}
					/>
					<PdfViewer 
						pages={this.state.pages} 
						scale={this.state.scale}
						pageIndex={this.state.pageIndex}
						updatePageIndex={function(index) {
							that.setState(
								Object.assign({}, that.state, {pageIndex:index})
							);
							that.needUploadMetadata = true;
						}}
						onInitialRenderFinished={ function() {
							that.updatePhase(
								that.phase | that.phases.pagePlaceHolderRendered
							);
						}}
					/>
				</div>)
	},

	updatePhase: function(newPhase) {
		console.log('phase: ' + this.phase + '->' + newPhase);
		this.phase = newPhase;
	}
});
