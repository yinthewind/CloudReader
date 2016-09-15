var React = require('react');
var ReactDOM = require('react-dom');
var PdfViewer = require('./../src/PdfViewer');

ReactDOM.render(
	<PdfViewer 
		url={ "example.pdf" } 
		initialPageIndex={2} 
		syncHandler={test}/>,
	document.getElementById('container')
);

function test() { console.log('#' + this) }
