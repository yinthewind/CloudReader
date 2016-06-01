var React = require('react');
var BookList = require('./BookList');

module.exports = React.createClass({
	render: function() {
		return (
			<div>
				<BookList books={this.props.files}/>
			</div>
		)
	}
});
