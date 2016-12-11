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
import { logoutUser } from 'common/actions/Auth';

class Dashboard extends Component {
  static propTypes = {
    routes: PropTypes.array,
    dispatch: PropTypes.func,
    user: PropTypes.object,
    children: PropTypes.object,
    location: PropTypes.object.isRequired,
    currentRoute: PropTypes.object,
    isMounted: PropTypes.bool,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  toggleDrawer = () => {
    document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
    const dimmer = document.querySelector('.mdl-layout__obfuscator');
    dimmer.classList.remove('is-visible');
  };

  generateLinks() {
    const links = [{
      to: '/',
      name: 'Overview',
      icon: 'note',
    }, {
      to: '/settings',
      name: 'Settings',
      icon: 'settings',
    },
    // {
    //   to: '/users',
    //   name: 'Users',
    //   icon: 'people',
    // },
     {
      to: '/topics',
      name: 'Topics',
      icon: 'list',
    }];

    return links;
  }

  goToUrl = (path, evt) => {
    evt.preventDefault();
    const { router } = this.context;
    router.push(path);
  };

  getTransition = () => {
    const { location: { state }, isMounted } = this.props;
    let transition;
    if (isMounted && state && state.hasOwnProperty('transition')) {
      transition = presets[state.transition];
    } else {
      transition = presets.noTransition;
    }
    return transition;
  };

  logout = () => {
    const { dispatch } = this.props;
    dispatch(logoutUser());
  };

  render() {
    const { user, notify, currentRoute } = this.props;
    const transition = this.getTransition();
    const avatar = user.avatar;
    const fullName = `${user.firstname} ${user.lastname}`;
    const links = this.generateLinks();

    return (
      <div style={{ minHeight: '100%', height: '100%', position: 'relative' }}>
        <Helmet title={`${currentRoute.name} - Labadipost`} />
        <Layout fixedHeader fixedDrawer>
          <DashBar title={currentRoute.name} goToUrl={this.goToUrl} logout={this.logout} />
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
                  onlyActiveOnIndex={link.to === '/'}
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
                  notify: notify,
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