var ListItem = require('./ListItem');
var ReactDOM = require('react-dom');
var React = require('React');


var port = chrome.extension.connect({ name: 'Sample Connection' });

port.onMessage.addListener(function(response) {
	var data = JSON.parse(response);

	ReactDOM.render(
		<div>
			{ 
				data.files.map(function(file) {
					return React.createElement(ListItem, { text: file.name });
				})
			}
		</div>,
		document.getElementById('container')
	);
});

document.addEventListener('DOMContentLoaded', function() {

	document.getElementById('btn1').onclick = function() {
		port.postMessage('hi');
	}

	document.getElementById('btn2').onclick = function() {
		chrome.tabs.create({ url: 'page.html' });
	}
});
