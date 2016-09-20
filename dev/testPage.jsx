var React = require('react');
var ReactDOM = require('react-dom');
var PdfViewer = require('./../src/PdfViewer');

ReactDOM.render(
	<PdfViewer 
		url={ 'example.pdf' } 
		fileId={ 'example file id' } 
		sendMessage={mockRequestExecutor}
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
