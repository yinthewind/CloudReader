var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./../src/App');
import StorageAdapter from './../src/StorageAdapter';
import GoogleDriveApi from './../src/GoogleDriveApi';

if(!window.location.search) {
	window.location.search = 'webContentLink=driver-full.pdf&fileId=sample';
}

ReactDOM.render(
	<App 
		storageAdapter={new StorageAdapter(new mockDriveApi())}
	/>,
	document.getElementById('container')
);

function mockDriveApi() {
	this.listFile = function() { 
		return Promise.resolve(null); 
	}
	this.getMeta = function() { 
		return Promise.resolve({
			id: 'example comment id',
			pageIndex: 0,
			scale: 1.5,
			version: 0.99
		}); 
	}
	this.putMeta = function(file, data) { 
		console.log(data);
		return null;
	}
}
