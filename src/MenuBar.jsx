require('./Menu.css');
var React = require('react');
var MenuItem = require('./MenuItem');

module.exports = React.createClass({
	
	render: function() {
		return (
		<div className='menu-bar'>{
			this.props.items && this.props.items.map(function(item) { 
				return <MenuItem data={item}></MenuItem>
			})
		}</div>)
	}
});
