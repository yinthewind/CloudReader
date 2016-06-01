var React = require('react');

module.exports = React.createClass({
	render: function() {
		text = this.props.text;
		clickHandler = this.props.clickHandler;
		return <div className='list-item' onClick={clickHandler} > {text} </div>
	}
});
