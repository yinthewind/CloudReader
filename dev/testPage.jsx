var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./../src/App');
import RequestExecutor from './../src/RequestExecutor';

if(!window.location.search) {
	window.location.search = 'webContentLink=single-page.pdf&fileId=sample';
}
ReactDOM.render(
	<App 
		requestExecutor={ new RequestExecutor(mockRequestExecutor) }
	/>,
	document.getElementById('container')
);

function mockRequestExecutor(data, callback) {
	var response = null;
	switch(data.type) {
		case 'getMetadata': 
			response = {
				id: 'example comment id',
				pageIndex: 0,
				scale: 1.5,
				version: 0
			};
		break;
		case 'uploadMetadata':
			console.log(data);
		break;
	}
	if(callback) {
		callback(response);
	}
}
