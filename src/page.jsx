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
					syncHandler={syncProgress}/>,
				document.getElementById('container')
			);
		}
	}
);

function syncProgress(fileId, commentId, currentIndex, getProgressCallback) {
		
	var commendId = null;
	var cloudIndex = null;
	chrome.runtime.sendMessage({ type: 'getProgress', fileId: fileId }, function(response) {
		if(response != null) {
			cloudIndex = response.content.split(':').pop();
			commentId = response.id;
			if(cloudIndex > currentIndex) {
				getProgressCallback(cloudIndex);
			}
			console.log('cloudIndex: ' + cloudIndex + '###currentIndex' + currentIndex);
		}

		if(cloudIndex == null || cloudIndex < currentIndex) {
			var request = {
				type: 'uploadProgress',
				fileId: fileId,
				commentId: commentId,
				data: { content: 'CloudReaderProgress:' +  currentIndex }
			};
			
			chrome.runtime.sendMessage(request);
			console.log('uploading');
		}
	});
}
