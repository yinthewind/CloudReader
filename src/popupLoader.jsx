var ReactDOM = require('react-dom');
var React = require('react');
var Popup = require('./Popup');

document.addEventListener('DOMContentLoaded', function() {

	chrome.runtime.sendMessage({type: "listPdf"}, function(response) {

		var data = JSON.parse(response);

		data.files.forEach(file => {
			file.handler = function() {
				chrome.runtime.sendMessage({
					type: "openPdf", 
					fileId: file.id, 
					webContentLink: file.webContentLink
				});
			}
		});

		ReactDOM.render(
			<Popup files={data.files}/>,
			document.getElementById('container')
		);
	});
});
