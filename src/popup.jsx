var ReactDOM = require('react-dom');
var React = require('react');
var PopWin = require('./PopWin');

document.addEventListener('DOMContentLoaded', function() {

	chrome.runtime.sendMessage({type: "listPdf"}, function(response) {

		var data = JSON.parse(response);

		data.files.forEach(file => {
			file.handler = function() {
				chrome.runtime.sendMessage({type: "openPdf", fileId: file.id});
			}
		});

		ReactDOM.render(
			<PopWin files={data.files}/>,
			document.getElementById('container')
		);
	});
});
