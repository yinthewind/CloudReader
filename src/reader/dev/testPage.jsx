var React = require('react');
var ReactDOM = require('react-dom');
var App = require('../App');
import StorageAdapter from '../../storage/StorageAdapter';
import GoogleDriveApi from '../../storage/GoogleDriveApi';

if(!window.location.search) {
	window.location.search = 'webContentLink=pdfSamples/driver-full.pdf&fileId=sample';
}

ReactDOM.render(
	<App 
		storageAdapter={new StorageAdapter(new mockDriveApi())}
	/>,
	document.getElementById('container')
);

function mockDriveApi() {
	this.listFiles = function() { 
		return Promise.resolve(null); 
	}
	this.getMeta = function() { 
		//return Promise.reject('unhappy');
		return Promise.resolve({
			id: 'example comment id',
			pageIndex: 0,
			scale: 1.5,
			version: 0.99
		}); 
	}
	this.putMeta = function(file, data) { 
		//return Promise.reject('failed to upload reading progress');
		console.log(data);
		return null;
	}
}
