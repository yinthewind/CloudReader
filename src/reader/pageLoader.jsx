'use strict'

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./App');
import GoogleDriveApi from '../storage/GoogleDriveApi';
import StorageAdapter from '../storage/StorageAdapter';

ReactDOM.render(
	<App 
		storageAdapter={new StorageAdapter(new GoogleDriveApi())}
	/>,
	document.getElementById('container')
);

