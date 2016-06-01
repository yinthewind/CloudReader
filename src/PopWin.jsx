require('./Popup.css');
var React = require('react');
var BookList = require('./BookList');


module.exports = React.createClass({
	render: function() {
		return (
			<div className='pop-win'>
				<BookList books={this.props.files}/>
			</div>
		)
	}
});
