require('./Popup.css');
var React = require('react');
var BookList = require('./BookList');


module.exports = React.createClass({
	render: function() {
		return (
			<div className='popup'>
				<div className='popup-title'>Below are the PDFs in your Google Drive. <a href={'https://drive.google.com/'}>Click here to Upload more PDFs</a> and start reading</div>
				<BookList books={this.props.files}/>
			</div>
		)
	}
});
