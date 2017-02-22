var React = require('react');
var MenuItem = require('./MenuItem');
import { IoAndroidAdd, IoAndroidRemove } from 'react-icons/lib/io';

module.exports = React.createClass({
	
	render: function() {
		return (
		<div className='menu-bar'>
			<div className='menu-mid'>
				<MenuItem 
					text={this.props.pageIndex + "/" + this.props.pageNum} 
				/>
			</div>
			<div className='menu-left'>
				<MenuItem text ='CloudReader'/>
			</div>	
			<div className='menu-right'>
				<MenuItem 
					onClick={this.props.increaseHandler}
					icon={<IoAndroidAdd className='menu-icon'/>}
				/>
				<MenuItem
					onClick={this.props.decreaseHandler}
					icon={<IoAndroidRemove className='menu-icon'/>}
				/>
			</div>
		</div>)
	}
});
