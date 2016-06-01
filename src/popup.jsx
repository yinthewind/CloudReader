var ReactDOM = require('react-dom');
var React = require('react');
var PopWin = require('./PopWin');


var port = chrome.extension.connect({ name: 'Sample Connection' });

port.onMessage.addListener(function(response) {
	var data = JSON.parse(response);

	ReactDOM.render(
		<PopWin files={data.files}/>,
		document.getElementById('container')
	);
});

document.addEventListener('DOMContentLoaded', function() {

	port.postMessage('hi');

	document.getElementById('btn2').onclick = function() {
		chrome.tabs.create({ url: 'page.html' });
	}
});
