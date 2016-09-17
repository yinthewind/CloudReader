'use strict'

var React = require('react');
var ReactDOM = require('react-dom');
var PdfViewer = require('./PdfViewer');

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		
		if(request.type == 'openPdf') {
			
			ReactDOM.render(
				<PdfViewer 
					url={request.bookUrl}
					fileId={request.fileId}
				/>,
				document.getElementById('container')
			);
		}
	}
);

