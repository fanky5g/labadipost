import React, { PropTypes, Component } from '#node_modules/react';
import { connect } from '#node_modules/react-redux';
import { getButtonChromelessStyles } from '#lib/commonStyles';

class Avatar extends Component {
  static propTypes = {
    user: PropTypes.object,
    className: PropTypes.string,
  };

  getAvatarStyles = () => {
    return {
      display: 'block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: 'normal',
    };
  };

  getAvatarImageStyle = () => {
    return {
      width: '32px',
      height: '32px',
      display: 'inline-block',
      verticalAlign: 'middle',
      borderRadius: '100%',
    };
  };

  render() {
    const { user } = this.props;

    return (
      <button
        style={getButtonChromelessStyles()}
      >
        <div style={this.getAvatarStyles()}>
          <img style={this.getAvatarImageStyle()} src={user.avatar} alt={user.firstname}/>
        </div>
      </button>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.Account.toJSON().user,
});

export default connect(mapStateToProps)(Avatar);
