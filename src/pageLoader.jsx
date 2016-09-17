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
					sendMessage={chrome.runtime.sendMessage}
				/>,
				document.getElementById('container')
			);
		}
	}
);

function getProgress(fileId, currentIndex) {
	chrome.runtime.sendMessage(
		{ type: 'getProgress', fileId: fileId },
		function(response) {
			if(response == null) return;
			cloudIndex = response.content.split(':').pop();
			commentId = response.id;
			console.log('get progress: ' + cloudIndex); 
		}
	);
}

function uploadProgress(fileId, commentId, currentIndex) {
	var request = {
		type: 'uploadProgress',
		fileId: fileId,
		commentId: commentId,
		data: { content: 'CloudReaderProgress:' + currentIndex }
	};
	chrome.runtime.sendMessage(request);
	console.log('uploading');
}
