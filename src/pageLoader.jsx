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

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
