var $ = require('jquery');
var PDFJS = require('pdfjs-dist');
var React = require('react');
var MenuBar = require('./MenuBar');
var PdfPage = require('./PdfPage');
var PdfViewer = require('./PdfViewer');
require('./Viewer.css');

module.exports = React.createClass({

	phase: 0,
	needUploadMeta: false,
	phases: {
		metadataDownloaded: 1,
		pageDataDownloaded: 2
	},

	initSyncHandler: function() {
		var that = this;
		var syncMetaHandler = function() {
			if(!that.needUploadMeta) {
				return;
			}
			that.needUploadMeta= false;

			that.props.storageAdapter.putMeta(
			{
				pageIndex: that.state.pageIndex,
				scale: that.state.scale
			});
		}
		setInterval(syncMetaHandler, 3000);
	},

	getPages: function() {
		var pagesPromise = this.props.storageAdapter.getPages();
		var that = this;
		pagesPromise.then((value)=>{
			that.updatePhase(that.phase | that.phases.pageDataDownloaded);
			that.setState({ pages: value });
		});
	},

	getMeta: function() {
		var that = this;
		var metaPromise = this.props.storageAdapter.getMeta();
		metaPromise.then((meta) => {
			that.metadata = meta;
			console.log(meta);
			that.updatePhase(that.phase | that.phases.metadataDownloaded);
			that.setState({
				scale: meta.scale,
				pageIndex: meta.pageIndex
			});
		});
	},
		
	getInitialState: function() {
		this.getPages();
		this.getMeta();
		this.initSyncHandler();

		var that = this;
		document.addEventListener('visibilitychange', function() {
			if(document.visibilityState === 'visible') {
				that.getMeta();
			}
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
							that.setState({scale: newScale});
						}}
						decreaseHandler={function() {
							var newScale = that.state.scale - 0.25;
							that.setState({scale: newScale});
						}}
						pageNum={this.state.pages.length}
						pageIndex={this.state.pageIndex + 1}
					/>
					<PdfViewer 
						pages={this.state.pages} 
						scale={this.state.scale}
						pageIndex={this.state.pageIndex}
						updatePageIndex={function(index) {
							that.setState({pageIndex:index});
							that.needUploadMeta= true;
						}}
					/>
				</div>)
	},

	updatePhase: function(newPhase) {
		console.log('phase: ' + this.phase + '->' + newPhase);
		this.phase = newPhase;
	}
});
