'use strict'

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./App');

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		
		if(request.type == 'openPdf') {
			
			ReactDOM.render(
				<App 
					url={request.bookUrl}
					fileId={request.fileId}
					sendMessage={chrome.runtime.sendMessage}
				/>,
				document.getElementById('container')
			);
		}
	}
);

