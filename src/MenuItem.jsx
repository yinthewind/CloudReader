var React = require('react');

module.exports = React.createClass({
	render: function() {
		var text = this.props.data.text;
		var onClick = this.props.data.onClick;

		return <div onClick={onClick}>{text}</div>
	}
})
