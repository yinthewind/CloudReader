var React = require('react');

module.exports = React.createClass({
	render: function() {
		var text = this.props.text;
		var clickHandler = this.props.clickHandler;
		return <div className='list-item' onClick={clickHandler} > {text} </div>
	}
});
