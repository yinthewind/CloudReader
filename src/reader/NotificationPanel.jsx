var React = require('react');
import { IoAlertCircled } from 'react-icons/lib/io';

module.exports = React.createClass({
	render: function() {
		if(!this.props.message) return null;
		return <div className={'notification-panel'}>
			<IoAlertCircled className='menu-icon'/>
			{this.props.message.toString()}
		</div>
	}
});
