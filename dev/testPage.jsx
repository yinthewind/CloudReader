var React = require('react');
var ReactDOM = require('react-dom');
var PdfViewer = require('./../src/PdfViewer');

ReactDOM.render(
	<PdfViewer 
		url={ "example.pdf" } 
		initialPageIndex={2} 
		syncHandler={function() {console.log(this)}}/>,
	document.getElementById('container')
);
