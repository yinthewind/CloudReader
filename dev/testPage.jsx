var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./../src/App');
import RequestExecutor from './../src/RequestExecutor';

ReactDOM.render(
	<App 
		requestExecutor={
			new RequestExecutor("example.pdf", "fileId", mockRequestExecutor)
		}
	/>,
	document.getElementById('container')
);

function mockRequestExecutor(data, callback) {
	var response = null;
	switch(data.type) {
		case 'getMetadata': 
			response = {
				id: 'example comment id',
				pageIndex: 4,
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
