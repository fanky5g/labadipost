import React, { Component, PropTypes } from 'react';
import { Cell, Textfield, Checkbox, Button, Icon } from 'react-mdl';
import { connect } from 'react-redux';
import login from '../actions';
import Link from 'react-router/lib/Link';
import Helmet from 'react-helmet';

class Login extends Component {
  static propTypes = {
    Account: PropTypes.object,
    notify: PropTypes.func,
    message: PropTypes.string,
    dispatch: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      password: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { notify, message } = nextProps;
    if (message !== '') {
      notify(message, this.clearMessage, 5000, 'Ok');
    }
  }

  componentWillUpdate = (nextProps) => {
    const { Account } = nextProps;

    if (Account.get('isAuthenticated')) {
      storage.setItem('token', JSON.stringify(Account.get('token')));
    }
  };

  onFieldChanged = evt => this.setState({ [evt.target.name]: evt.target.value });

  onSubmit = (evt) => {
    evt.preventDefault();
    const { dispatch } = this.props;
    dispatch(login(this.state));
  };

  clearMessage = () => {};

  render() {
    return (
      <div className="content">
        <Helmet title="Login" />
        <Cell col={6} tablet={6} phone={4} className="Login">
          <div className="Login__container">
            <div className="l">
              <a>
                <img alt="labadipost" src="/images/labadi-logo.svg" />
              </a>
              <h3 className="title">&copy; Labadipost</h3>
            </div>
            <div className="r">
              <div className="Login__container--header">
                <h4>Sign In</h4>
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
                <div className="Login__container--body-forgot">
                  <Link to="/forgot" className="Login__container--body-forgot__link">
                    Forgot Password
                  </Link>
                </div>
                <div className="Login__container--body-submit">
                  <Button raised ripple>Sign In</Button>
                </div>
              </form>
            </div>
          </div>
        </Cell>
      </div>
    );
  }
}

export default connect(state => ({ Account: state.Account }))(Login);
