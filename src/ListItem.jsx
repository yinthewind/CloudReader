var React = require('react');

module.exports = React.createClass({
	render: function() {
		text = this.props.text;
		clickHandler = this.props.clickHandler;
		return <div onClick={clickHandler}> {text} </div>
	}
});
