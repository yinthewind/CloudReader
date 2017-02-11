var React = require('react');
var ListItem = require('./ListItem');

module.exports = React.createClass({

	open(file) {
		var url = 'page.html?fileId=' + file.id + '&webContentLink=' + file.webContentLink;
		return function() { chrome.tabs.create({url: url}) };
	},

	render: function() {
		return (
			<div>
				{
					this.props.books.map(book => 
						<ListItem 
							key={book.id}
							text={book.name} 
							clickHandler={this.open(book)} />
					)
				}
			</div>
		)
	}
});
