import React, { Component, PropTypes } from 'react';
import { Cell } from 'react-mdl';
import steps from './components/steps';
import Multistep from './components/Multistep';
import { createUser } from '#routes/Account/actions';
import { connect } from 'react-redux';
import Login from '#routes/Login';
import Logo from '#common/components/Logo';

class Signup extends Component {
  static propTypes = {
    isWaiting: PropTypes.bool,
    message: PropTypes.string,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      lastname: '',
      firstname: '',
      email: '',
      username: '',
      password: '',
    };
  }

  onSignup = (finishForm) => {
    finishForm();
    // clear passMatchError propagated from password checking
    delete this.state.passMatchError;
    const { dispatch } = this.props;
    dispatch(createUser(this.state));
  };

  saveData = (fields, callback, evt) => {
    evt.preventDefault();
    if (fields !== null && typeof fields !== 'undefined') {
      this.setState(fields, () => {
        callback();
      });
    } else {
      callback();
    }
  };

  goToLogin = () => {
    const { replaceOverlay } = this.props;
    const Header = React.createClass({
      render() {
        return (
          <h3 className="overlay-title">
            <div>
              <span className="svgIcon svgIcon--logoNew svgIcon--85px">
                <Logo />
              </span>
            </div>
          </h3>
        );
      },
    });
    replaceOverlay({
      comp: Login,
      props: {
        classes: 'overlay-dialog--login',
        headerComponent: Header,
        replaceOverlay: replaceOverlay,
      },
    });
  };

  render() {
    const { isWaiting } = this.props;
    return (
      <div className="Signup">
        <div className="Signup__container--body">
          <Multistep
            steps={steps}
            onCallbackParent={this.saveData}
            fieldValues={this.state}
            onSignup={this.onSignup}
            isWaiting={isWaiting}
          />
          <button
            className="button button--primary button--large button--chromeless button--link l-marginTop15 l-marginAuto l-block"
            onClick={this.goToLogin}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isWaiting: state.Account.get('isWaiting'),
  message: state.Account.get('message'),
});

export default connect(mapStateToProps)(Signup);
