var ReactDOM = require('react-dom');
var React = require('react');
var Popup = require('./Popup');
import GoogleDriveApi from '../src/GoogleDriveApi';

document.addEventListener('DOMContentLoaded', function() {
	
	var api = new GoogleDriveApi();

	api.listFile().then(files => {
		ReactDOM.render(
			<Popup files={files}/>,
			document.getElementById('container')
		);
	})
	.catch(error => {
		document.getElementById('container').textContent = error;
	});
});
