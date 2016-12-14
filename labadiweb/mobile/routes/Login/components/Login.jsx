import React, { Component, PropTypes } from '#node_modules/react';
import Textfield from '#node_modules/react-mdl/lib/Textfield';
import Button from '#node_modules/react-mdl/lib/Button';
import { connect } from '#node_modules/react-redux';
import login from '../actions';
import LogoFacebook from '#common/components/LogoFacebook';
import LogoGPlus from '#common/components/LogoGPlus';
import LogoTwitter from '#common/components/LogoTwitter';
import Signup from '#routes/Signup';

const Header = React.createClass({
  render() {
    return (<h3 className="overlay-title">Sign up to Labadipost</h3>);
  }
});

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

  goToSignup = () => {
    const { replaceOverlay } = this.props;
    replaceOverlay({
      comp: Signup,
      props: {
        classes: 'overlay-dialog--signup',
        headerComponent: Header,
        replaceOverlay: replaceOverlay
      },
    });
  };

  onFieldChanged = evt => this.setState({ [evt.target.name]: evt.target.value });

  onSubmit = (evt) => {
    // evt.preventDefault();
    // const { dispatch } = this.props;
    // dispatch(login(this.state));
  };

  clearMessage = () => {};

  startOauth = (targetUrl) => {
    const location = window.location.href;
    const dest = `${targetUrl}?location=${location}`;
    window.location = dest;
  };

  render() {
    return (
      <div className="Login">
        <span className="login-header l-lineHeight30 l-height32">Sign in to Labadipost via</span>
        <div className="Login__container">
          <div className="social-buttons">
            <a className="facebook-login" onClick={() => this.startOauth('http://labadipost.com/api/v1/oauth/fb')}>
              <LogoFacebook />
            </a>
            <a className="twitter-login" onClick={() => this.startOauth('http://labadipost.com/api/v1/oauth/twitter')}>
              <LogoTwitter />
            </a>
            <a className="google-login" onClick={() => this.startOauth('http://labadipost.com/api/v1/oauth/google')}>
              <LogoGPlus />
            </a>
          </div>
          <form className="Login__container--body" onSubmit={this.onSubmit}>
            <div className="Login__container--body-inputfield">
              <Textfield
                label="Username/Email"
                floatingLabel
                onChange={this.onFieldChanged}
                required
                name="email"
              />
            </div>
            <div className="Login__container--body-inputfield">
              <Textfield
                label="Password"
                floatingLabel
                type="password"
                name="password"
                onChange={this.onFieldChanged}
                required
              />
            </div>
            <div className="Login__container--body-submit">
              <Button raised ripple>Sign In</Button>
            </div>
          </form>
          <button
            className="button button--primary button--large button--chromeless button--link l-marginTop15 l-marginAuto l-block"
            onClick={this.goToSignup}
          >
            Sign up with email
          </button>
        </div>
      </div>
    );
  }
}

export default connect(state => ({ Account: state.Account }))(Login);
