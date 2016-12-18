import React, { Component, PropTypes } from 'react';

class AccountCard extends Component {
	static propTypes = {
    user: PropTypes.object.isRequired,
	};

	getPageStyles = () => {
    return {
      display: 'flex',
    };
	};
  // should be able to logout from here
	render() {
		const { user } = this.props;

		return (
      <div style={this.getPageStyles()}>

      </div>
		);
	}
}

export default AccountCard;