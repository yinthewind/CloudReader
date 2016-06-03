var React = require('react');
var ListItem = require('./ListItem');

module.exports = React.createClass({
	render: function() {
		return (
			<div>
				{
					this.props.books.map(book => 
						<ListItem 
							key={book.id}
							text={book.name} 
							clickHandler={book.handler} />
					)
				}
			</div>
		)
	}
});
