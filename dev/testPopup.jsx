var PopWin = require('./../src/PopWin');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
	<PopWin files={[ 
		{name: "AAA", id: "111"},
		{name: "BBB", id: "222"},
		{name: "CCC", id: "333"}
	]}/>,
	document.getElementById('container')
);

