var React = require('react');
var ReactDOM = require('react-dom');
var PdfViewer = require('./../src/PdfViewer');

ReactDOM.render(
	<PdfViewer url={ "example.pdf" } />,
	document.getElementById('container')
);
