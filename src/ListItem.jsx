var React = require('React');

module.exports = React.createClass({
	render: function() {
		text = this.props.text;
		return <div> {text}  </div>
	}
});
