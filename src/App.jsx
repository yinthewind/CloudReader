var $ = require('jquery');
var PDFJS = require('pdfjs-dist');
var React = require('react');
var MenuBar = require('./MenuBar');
var PdfPage = require('./PdfPage');
var PdfViewer = require('./PdfViewer');
require('./Viewer.css');

module.exports = React.createClass({

	fileId: null,
	commentId: null,
	pageIndex: 0,

	phase: 0,
	requestExecutor: null,
	phases: {
		metadataDownloaded: 1,
		pageDataDownloaded: 2,
		pagePlaceHolderRendered: 4
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

		if(this.phase < 3) {
			return <div className='loader'/>
		} 

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
					<PdfViewer 
						pages={this.state.pages} 
						scale={this.state.scale}
						pageIndex={this.pageIndex}
						updatePageIndex={function(index) {
							that.pageIndex=index;
						}}
						onInitialRenderFinished={ function() {
							that.updatePhase(that.phase | that.phases.pagePlaceHolderRendered);
							}
						}
					/>
				</div>)
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
			var that = this;
			var handler = function() {
				that.uploadMetadata();
			}
			setInterval(handler, 10000);
		}
	}
});
