var React = require('react');
var MenuItem = require('./MenuItem');
import { IoAndroidAddCircle, IoAndroidRemoveCircle } from 'react-icons/lib/io';

module.exports = React.createClass({
	
	render: function() {
		return (
		<div className='menu-bar'>
			<div className='menu-left'>
				<MenuItem text ='CloudReader'/>
			</div>	
			<div className='menu-mid'>
				<MenuItem text ='CurrentPage/TotalPage' />
			</div>
			<div className='menu-right'>
				<MenuItem 
					onClick={this.props.increaseHandler}
					icon={<IoAndroidAddCircle className='menu-icon'/>}
				/>
				<MenuItem
					onClick={this.props.decreaseHandler}
					icon={<IoAndroidRemoveCircle className='menu-icon'/>}
				/>
			</div>
		</div>)
	}
});
