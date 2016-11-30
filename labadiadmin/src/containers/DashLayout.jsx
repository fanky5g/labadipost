import React, { Component, PropTypes } from 'react';
import {
  Layout,
  Header,
  Navigation,
  Drawer,
  Content,
  Icon,
} from 'react-mdl';
import Link from 'react-router/lib/Link';
import DashBar from 'common/components/DashBar';
import User from 'common/components/DashBarUser';
import { RouteTransition } from 'react-router-transition';
import * as presets from 'lib/transitions';
import NotificationComponent from 'common/components/NotificationComponent';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

class Dashboard extends Component {
  static propTypes = {
    routes: PropTypes.array,
    dispatch: PropTypes.func,
    user: PropTypes.object,
    children: PropTypes.object,
    location: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    active: false,
    message: '',
    dismissTimeout: 3000,
    label: 'ok',
  };

  componentDidMount() {
    this.onMount();
  }

  onMount = () => {
    const { dispatch } = this.props;
    this.setState({ isMounted: true });
    dispatch(initEnvironment());
  };

  toggleDrawer = () => {
    document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
    const dimmer = document.querySelector('.mdl-layout__obfuscator');
    dimmer.classList.remove('is-visible');
  };

  generateLinks() {
    const links = [{
      to: '/dashboard/overview',
      name: 'Overview',
      icon: 'note',
    }, {
      to: '/dashboard/settings',
      name: 'Settings',
      icon: 'settings',
    }, {
      to: '/dashboard/users',
      name: 'Users',
      icon: 'event',
    }];

    return links;
  }

  goToUrl = (path, evt) => {
    evt.preventDefault();
    const { router } = this.context;
    router.push(path);
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

  getTransition = () => {
    const { location: { state } } = this.props;
    let transition;
    if (this.state.isMounted && state && state.hasOwnProperty('transition')) {
      transition = presets[state.transition];
    } else {
      transition = presets.noTransition;
    }
    return transition;
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

  render() {
    const { user } = this.props;
    const transition = this.getTransition();
    const avatar = user.avatar;
    const fullName = `${user.firstname} ${user.lastname}`;
    const links = this.generateLinks();
    const currentRoute = this.props.routes[this.props.routes.length - 1];

    const { message, dismissTimeout, label, active, isMounted } = this.state;

    const Notification = (<NotificationComponent
      message={message}
      active={active}
      styles={this.getNotificationStyles()}
      label={label}
      dismissTimeout={dismissTimeout}
      action={this.action}
    />);

    return (
      <div style={{ minHeight: '100%', height: '100%', position: 'relative' }}>
        <Helmet title={`${currentRoute.name} - Labadipost`} />
        <Layout fixedHeader fixedDrawer>
          {isMounted && <DevTools />}
          {
            active && Notification
          }
          <DashBar title={currentRoute.name} goToUrl={this.goToUrl} />
          <Drawer onClick={this.toggleDrawer}>
            <Header className="Drawer__Header">
              <User className="Drawer__Header_avatar" passedAvatar={avatar} />
              <span
                className="Drawer__Header_title"
              >
                {fullName}
              </span>
            </Header>
            <Navigation className="sideNav">
            {
              links.map((link, index) => (
                <Link
                  to={link.to}
                  key={index}
                  activeClassName="active"
                >
                  {link.name}
                  <Icon name={link.icon} className="link-icon" />
                </Link>
                )
              )
            }
            </Navigation>
          </Drawer>
          <Content className="DashContent">
            <RouteTransition
              pathname={this.props.location.pathname}
              {...transition}
            >
              {
                this.props.children && React.cloneElement(this.props.children, {
                  user,
                  notify: this.notify,
                })
              }
            </RouteTransition>
          </Content>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.Account.toJSON().user,
});

export default connect(mapStateToProps)(Dashboard);