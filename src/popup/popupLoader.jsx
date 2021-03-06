var ReactDOM = require('react-dom');
var React = require('react');
var Popup = require('./Popup');
import GoogleDriveApi from '../storage/GoogleDriveApi';

document.addEventListener('DOMContentLoaded', function() {
	
	var api = new GoogleDriveApi();

	api.listFiles().then(files => {
		ReactDOM.render(
			<Popup files={files}/>,
			document.getElementById('container')
		);
	})
	.catch(error => {
		document.getElementById('container').textContent = error;
	});
});
