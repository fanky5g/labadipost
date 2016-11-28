import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';
import DevTools from '#common/middleware/DevTools';
import { initEnvironment } from '#common/actions/App';
import { RouteTransition } from 'react-router-transition';
import * as presets from '#lib/transitions';
import Menu from 'react-mdl/lib/Menu';
import { MenuItem } from 'react-mdl/lib/Menu';
import IconButton from 'react-mdl/lib/IconButton';
import Link from 'react-router/lib/Link';
import { logout } from '#common/actions/Auth';
import { connect } from 'react-redux';
import Avatar from '#common/components/Avatar';
import { constructOv, disposeOv, replaceOv } from '#common/actions/Overlay';
import Login from '#routes/Login';
import OverlayComponent from '#common/components/OverlayComponent';
import Logo from '#common/components/Logo';

if (typeof window !== 'undefined') {
  require('react-mdl/extra/material.min');
  require('material-design-icons/iconfont/material-icons.css');
  require('#styles/mdl-styles/material-design-lite.scss');
}

class App extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    isMounted: false,
  };

  onLogout = () => {
    const { dispatch } = this.props;
    dispatch(logout());
  };

  goToUrl = (path, query, state) => {
    // this.goToUrl('/login', {}, { transition: 'slideLeftTransition' })
    const { router } = this.context;
    router.push({
      pathname: path,
      query,
      state,
    });
  };

  componentDidMount() {
    this.onMount();
  }

  onMount = () => {
    const { dispatch } = this.props;
    this.setState({ isMounted: true });
    dispatch(initEnvironment());
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

  disposeOverlay = () => {
    const { dispatch } = this.props;
    dispatch(disposeOv());
  };

  constructOverlay = ({comp, props}) => {
    const { dispatch } = this.props;
    dispatch(constructOv({
      component: comp,
      props,
    }));
  };

  replaceOvComponent = ({comp, props}) => {
    const { dispatch } = this.props;
    dispatch(replaceOv({
      component: comp,
      props,
    }));
  };

  goToLogin = () => {
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

    this.constructOverlay({
      comp: Login,
      props: {
        classes: 'overlay-dialog--signin',
        headerComponent: Header,
        replaceOverlay: this.replaceOvComponent,
      }
    });
  };

  render() {
    const { isMounted } = this.state;
    const transition = this.getTransition();
    const {isAuthenticated, overlay: { ovActive, ovComponent, ovProps}} = this.props;
    const currentRoute = this.props.routes[this.props.routes.length - 1];

    return (<div
        style={{
          marginBottom: '-165px',
        }}
        id="main"
      >
        <Helmet title={`${currentRoute.name} | Labadipost`} />
        {isMounted && <DevTools />}
        {ovActive && <OverlayComponent component={ovComponent} isActive={ovActive} props={ovProps} dispose={this.disposeOverlay} />}
        <header className="metabar">
          <div className="metabar-inner l-borderBottomThinLight l-clearfix l-marginAuto l-paddingRight20 l-paddingLeft20">
            <div className="metabar-block l-floatLeft l-height65 l-xs-height56">
              <Link to="/" className="siteNav-logo">
                <img
                  src={`/static/build/images/rsz_labadipost.png`}
                  className="icon-logo"
                  alt="labadipost"
                />
              </Link>
            </div>
            <div className="metabar-block l-floatRight l-xs-absolute l-xs-textAlignRight l-xs-right0 l-xs-marginRight20 l-height65 l-xs-height56">
              <div className="buttonSet">
                {
                  isAuthenticated &&
                  <div>
                    <Avatar />
                    <Menu
                      target="profile-drop"
                      ripple
                      className="mdl-shadow--3dp AppBar__menu-item-dropdown"
                    >
                      <MenuItem onClick={() => this.goToUrl('/dashboard')}>Dashboard</MenuItem>
                      <MenuItem onClick={this.onLogout}>Logout</MenuItem>
                    </Menu>
                  </div>
                }
                {
                  !isAuthenticated &&
                  <span
                    onClick={this.goToLogin}
                    className="button button--primary button--chromeless is-inSiteNavBar l-lineHeight30 l-height32"
                  >
                    Sign in / Sign up
                  </span>
                }
              </div>
            </div>
          </div>
        </header>
        <div className="Content">
          <RouteTransition
            pathname={this.props.location.pathname}
            {...transition}
          >
          {this.props.children}
          </RouteTransition>
        </div>
      </div>);
  }

}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Account.toJSON().isAuthenticated,
  overlay: state.Overlay.toJSON(),
});

export default connect(mapStateToProps)(App);