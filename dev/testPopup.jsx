var Popup = require('./../src/Popup');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
	<Popup files={[ 
		{
			name: 'The HitchHiker\'s Guide to the Galaxy - Douglas Adams',
			id: '1', 
			webContentLink: 'hehe'
		},
		{
			name: 'Fall of Giants: The Century Trilogy, Book 1 - Ken Follett', 
			id: '2', 
			webContentLink: 'keke'
		},
		{
			name: 'The Fall of Hyperion - Dan Simmons', 
			id: '3', 
			webContentLink: 'haha'
		},
		{
			name: 'Ten Days that Shook the World - John Reed',
			id: '4',
			webContentLink: 'hihi'
		},
		{
			name: 'If on a Winter\'s Night a Traveler - Italo Calvino',
			id: '5',
			webContentLink: 'hihi'
		}
	]}/>,
	document.getElementById('container')
);

