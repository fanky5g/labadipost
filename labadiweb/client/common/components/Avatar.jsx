import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

class Avatar extends Component {
  static propTypes = {
    user: PropTypes.object,
    className: PropTypes.string,
  };

  render() {
    const { user } = this.props;

    return (
      <button
        className="button button--chromeless is-inSiteNavBar"
        style={{ display: 'inline-block' }}
        id="profile-drop"
      >
        <div className="avatar">
          <img className="avatar-image avatar-image--icon" src={user.avatar} alt={user.firstname}/>
        </div>
      </button>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.Account.toJSON().user,
});

export default connect(mapStateToProps)(Avatar);
