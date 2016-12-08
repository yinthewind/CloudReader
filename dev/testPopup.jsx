var Popup = require('./../src/Popup');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
	<Popup files={[ 
		{name: 'AAA', id: '111', webContentLink: 'hehe'},
		{name: 'BBB', id: '222', webContentLink: 'keke'},
		{name: 'CCC', id: '333', webContentLink: 'haha'}
	]}/>,
	document.getElementById('container')
);

