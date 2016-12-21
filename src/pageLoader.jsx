'use strict'

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./App');
import RequestExecutor from './RequestExecutor';

ReactDOM.render(
	<App 
		requestExecutor={
			new RequestExecutor(chrome.runtime.sendMessage)
		}
	/>,
	document.getElementById('container')
);

