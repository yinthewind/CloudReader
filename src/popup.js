var port = chrome.extension.connect({ name: 'Sample Connection' });

port.onMessage.addListener(function(response) {
	var data = JSON.parse(response);
	document.getElementById('container').innerHTML = 
		data.files.map((file) => file.name);
});

document.addEventListener('DOMContentLoaded', function() {

	document.getElementById('btn1').onclick = function() {
		port.postMessage('hi');
	}

	document.getElementById('btn2').onclick = function() {
		chrome.tabs.create({ url: 'page.html' });
	}
});
