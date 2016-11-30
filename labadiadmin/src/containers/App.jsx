import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import NotificationComponent from 'common/components/NotificationComponent';
import classNames from 'classnames';
import DashLayout from 'containers/DashLayout';
import Login from 'routes/Login';
import DevTools from 'common/middleware/DevTools';
import { initEnvironment } from 'common/actions/App';

if (process.env.BROWSER) {
  /* eslint global-require: "off" */
  // move this to require.ensure block for root
  require('react-mdl/extra/material.min');
  // in production change to cdn files
  require('material-design-icons/iconfont/material-icons.css');
  require('styles/mdl-styles/material-design-lite.scss');
  // application styles
  require('styles/main.scss');
}

class AppView extends Component {
  static propTypes = {
    routes: PropTypes.array,
    user: PropTypes.object,
    environment: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    Account: PropTypes.object,
    children: PropTypes.object,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      active: false,
      message: '',
      dismissTimeout: 3000,
      label: 'ok',
    };
  }

  componentDidMount() {
    this.onMount();
  }

  onMount = () => {
    const { dispatch } = this.props;
    this.setState({ isMounted: true });
    dispatch(initEnvironment());
  };

  getNotificationStyles = () => {
    const bar = {
      background: '#263238',
      zIndex: '10000000000000',
    };
    let noteDimensions = { width: 0 };
    let note;
    let active;

    if (process.env.BROWSER) {
      note = document.querySelector('.notification-bar');
      if (note) {
        noteDimensions = note.getBoundingClientRect();
      }
      active = {
        left: `${(Math.floor(window.innerWidth - noteDimensions.width) / 2)}px`,
      };
    }

    const action = {
      color: '#FFCCBC',
    };

    return { bar, active, action };
  };

  notify = (message, action, dismissTimeout, label = 'ok') => {
    this.setState({
      active: true,
      message,
      dismissTimeout,
      label,
      nAction: action,
    });
  };

  action = () => {
    const { nAction } = this.state;
    this.setState({
      active: false,
    });
    if (typeof nAction === 'function') {
      nAction();
    }
  };

  render() {
    // this is where basic structure shud live
    const { user, dispatch, Account } = this.props;
    const { message, dismissTimeout, label, active, isMounted } = this.state;
    const currentRoute = this.props.routes[this.props.routes.length - 1];
    const children = React.cloneElement(this.props.children, {
      notify: this.notify,
      user,
      dispatch,
      Account,
    });
    const isAuth = Account.get('isAuthenticated');

    const Notification = (<NotificationComponent
      message={message}
      active={active}
      styles={this.getNotificationStyles()}
      label={label}
      dismissTimeout={dismissTimeout}
      action={this.action}
    />);

    const Dashboard = (
      <DashLayout
        user={user}
        notify={this.notify}
        dispatch={dispatch}
        Account={Account}
      >
        {children}
      </DashLayout>
    );

    return (
      <div id="app-view" className={classNames({ [`${currentRoute.name}page`]: true })}>
        <Helmet title={`${currentRoute.name} - Labadipost`} />
         {isMounted && <DevTools />}
        {
          active && Notification
        }
        {
          isAuth ? <Dashboard /> : <Login />
        }
        
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.Account.toJSON().user,
  environment: state.Environment.toJSON(),
  Account: state.Account,
});

export default connect(mapStateToProps)(AppView);
