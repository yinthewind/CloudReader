'use strict'

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./App');
import RequestExecutor from './RequestExecutor';

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		
		if(request.type == 'openPdf') {
			
			ReactDOM.render(
				<App 
					requestExecutor={
						new RequestExecutor(
							request.bookUrl,
							request.fileId,
							chrome.runtime.sendMessage)
					}
				/>,
				document.getElementById('container')
			);
		}
	}
);

