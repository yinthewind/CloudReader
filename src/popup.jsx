var ReactDOM = require('react-dom');
var React = require('react');
var PopWin = require('./PopWin');

document.addEventListener('DOMContentLoaded', function() {

	chrome.runtime.sendMessage({type: "listPdf"}, function(response) {

		var data = JSON.parse(response);

		ReactDOM.render(
			<PopWin files={data.files}/>,
			document.getElementById('container')
		);
	});

	document.getElementById('btn2').onclick = function() {
		chrome.tabs.create({ url: 'page.html' });
	}
});
