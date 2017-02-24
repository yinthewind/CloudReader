var React = require('react');

module.exports = React.createClass({
	render: function() {
		if(!this.props.message) return null;
		return <div className={'notification-panel'}>{this.props.message.toString()}</div>
	}
});
