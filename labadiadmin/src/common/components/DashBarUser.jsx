import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

class DashBarUser extends Component {
  static propTypes = {
    user: PropTypes.object,
    passedAvatar: PropTypes.string,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const { user } = this.props;
  }

  render() {
    const { user, passedAvatar } = this.props;
    let avatar;
    if (!passedAvatar && !!user) avatar = user.avatar;
    const avatarUrl = passedAvatar || avatar;

    return (
      <div className="DashBarUser" style={{ display: 'inline-block' }}>
      {
        avatarUrl &&
          <img
            className={this.props.className || 'AppBarUser__avatar'}
            alt="avatar"
            src={avatarUrl}
          />
      }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.Account.toJSON().user,
});

export default connect(mapStateToProps)(DashBarUser);
