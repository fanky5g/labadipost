import React, { Component, PropTypes } from '#node_modules/react';
import Textfield from '#node_modules/react-mdl/lib/Textfield';
import Button from '#node_modules/react-mdl/lib/Button';
import { connect } from '#node_modules/react-redux';
import login from '../actions';
import LogoFacebook from '#common/components/LogoFacebook';
import LogoGPlus from '#common/components/LogoGPlus';
import LogoTwitter from '#common/components/LogoTwitter';
import Signup from '#routes/Signup';
import { getButtonStyles } from '#lib/commonStyles';

class Login extends Component {
  static propTypes = {
    Account: PropTypes.object,
    notify: PropTypes.func,
    message: PropTypes.string,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      password: '',
    };
  }

  onFieldChanged = evt => this.setState({ [evt.target.name]: evt.target.value });

  clearMessage = () => {};

  startOauth = (targetUrl) => {
    const location = window.location.href;
    const dest = `${targetUrl}?location=${location}`;
    window.location = dest;
  };

  getLoginHeaderStyle = () => {
    return {
      display: 'inherit',
      textAlign: 'center',
      textTransform: 'uppercase',
      marginBottom: '10px',
      lineHeight: '30px!important',
      height: '32px!important',
    };
  };

  getSocialButtonStyles = () => {
    return {
      display: 'flex',
      WebkitJustifyContent: 'space-between',
      MsFlexPack: 'justify',
      justifyContent: 'space-between',
      WebkitAlignItems: 'center',
      MsFlexAlign: 'center',
      alignItems: 'center',
    };
  };

  getSocialLinkStyle = () => {
    return {
      position: 'relative',
      display: 'inline-block',
      color: '#fff',
      cursor: 'pointer',
      height: '50px',
      width: '32.5%',
      display: 'inline-flex',
      WebkitJustifyContent: 'center',
      MsFlexPack: 'center',
      justifyContent: 'center',
      WebkitAlignItems: 'center',
      MsFlexAlign: 'center',
      alignItems: 'center',
      height: '40px',
    };
  };

  getInputStyle = () => {
    return {
      color: '#333',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '22px',
      backgroundColor: '#fbfbfb',
      padding: '10px',
      marginBottom: '10px',
      width: '100%',
      WebkitBoxSizing: 'border-box',
      MozBoxSizing: 'border-box',
      MsBoxSizing: 'border-box',
      boxSizing: 'border-box',
      borderColor: '#f7f7f7',
    };
  };

  render() {
    return (
      <div>
        <span style={this.getLoginHeaderStyle()}>Sign in to Labadipost via</span>
        <div style={{position: 'relative'}}>
          <div style={this.getSocialButtonStyles()}>
            <a
              style={{...this.getSocialLinkStyle(), background: '#3B5999'}}
              onClick={() => this.startOauth('http://labadipost.com/api/v1/oauth/fb')}>
              <LogoFacebook />
            </a>
            <a
              style={{...this.getSocialLinkStyle(), background: '#3BA9EE'}}
              onClick={() => this.startOauth('http://labadipost.com/api/v1/oauth/twitter')}>
              <LogoTwitter style={{height: '15px'}}/>
            </a>
            <a
              style={{...this.getSocialLinkStyle(), background: '#DC4A38'}}
              onClick={() => this.startOauth('http://labadipost.com/api/v1/oauth/google')}>
              <LogoGPlus />
            </a>
          </div>
          <form style={{padding: '10px 0'}} onSubmit={this.onSubmit}>
            <div>
              <input
                placeholder="Username/Email"
                style={this.getInputStyle()}
                onChange={this.onFieldChanged}
                required
                name="email"
              />
            </div>
            <div>
              <input
                placeholder="Password"
                style={this.getInputStyle()}
                type="password"
                name="password"
                onChange={this.onFieldChanged}
                required
              />
            </div>
            <div>
              <button style={{
                  ...getButtonStyles(),
                  width: '100%',
                  background: '#09c',
                  color: '#fff',
                  textTransform: 'none',
                  borderRadius: 0,
              }}>
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(state => ({ Account: state.Account }))(Login);
