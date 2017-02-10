var ReactDOM = require('react-dom');
var React = require('react');
var Popup = require('./Popup');
import GoogleDriveApi from '../src/GoogleDriveApi';

document.addEventListener('DOMContentLoaded', function() {
	
	var api = new GoogleDriveApi();

	api.listFile().then(files => {
		files.forEach(file => {
			file.handler = function() {
				chrome.runtime.sendMessage({
					type: "openPdf",
					fileId: file.id,
					webContentLink: file.webContentLink
				});
			}
		});

		ReactDOM.render(
			<Popup files={files}/>,
			document.getElementById('container')
		);
	});
});
