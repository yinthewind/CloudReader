var React = require('react');

module.exports = React.createClass({
	render: function() {
		var icon = this.props.icon;
		var text = this.props.text;
		var onClick = this.props.onClick;

		return <div className='menu-item' onClick={onClick}>
			{icon}
			<p>{text}</p>
		</div>
	}
})
