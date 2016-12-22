import React, { Component, PropTypes } from '#node_modules/react';
import Icon from '#common/components/Icon';
import { disposeOv } from '#common/actions/Overlay';
import Login from '#routes/Login';
import OverlayComponent from '#common/components/OverlayComponent';
import { connect } from '#node_modules/react-redux';
import { getCookie } from "#lib/cookie";
import { getLoggedUser } from '#routes/Account/actions';
import { provideHooks } from 'redial';
import { getPrefs } from '#common/actions/Prefs';
import { RouteTransition } from '#node_modules/react-router-transition';
import * as presets from '#lib/transition';

/* eslint global-require: "off" */
// move this to require.ensure block for root
require('#node_modules/react-mdl/extra/material.min');
// <Icon name="device/ic_access_alarm_24px" className="svg-24px" />

class App extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  getAppStyles = () => {
    return {
      background: '#f7f7f7',
      height: this.getSize().height,
    };
  };

  getSize = () => {
    return document.getElementById("main").getBoundingClientRect();
  };

  disposeOverlay = () => {
    const { dispatch } = this.props;
    dispatch(disposeOv());
  };

  getTransition = () => {
    const { location: { state } } = this.props;
    let transition;
    if (state && state.hasOwnProperty('transition')) {
      transition = presets[state.transition];
    } else {
      transition = presets.noTransition;
    }
    return transition;
  };

  goToUrl = (path, query, state, method) => {
    const { router } = this.context;
    if (method) {
      router[method]({
        pathname: path,
        query,
        state,
      });
      return;
    }

    router.push({
      pathname: path,
      query,
      state,
    });
  };

  getPathname = () => {
    const allowedSubRoutes = ['/', '', 'options', '/options'];
    if (allowedSubRoutes.indexOf(this.props.location.pathname) !== -1) {
      return '/';
    } else {
      return this.props.location.pathname;
    }
  };

  render() {
    const {isAuthenticated, overlay: { ovActive, ovComponent, ovProps}, loading} = this.props;
    const transition = this.getTransition();

    return (
      <div id="app" className="fill" style={this.getAppStyles()} ref="pageContainer">
        {ovActive && <OverlayComponent component={ovComponent} isActive={ovActive} props={ovProps} dispose={this.disposeOverlay} />}
        <RouteTransition
          pathname={this.getPathname()}
          {...transition}
        >
          {
            React.cloneElement(this.props.children, {
              isAuthenticated: isAuthenticated,
              goToUrl: this.goToUrl,
              loading,
            })
          }
        </RouteTransition>
      </div>
    );
  }
}

const hooks = {
  defer: ({dispatch, store: {getState}}) => {
    const promises = [];
    const jwtCookie = getCookie("jwt-storage");
    const isAuthenticated = getState().Account.get('isAuthenticated');
    const prefsLoaded = getState().Prefs.get('loaded');

    if (jwtCookie && !isAuthenticated) {
      promises.push(dispatch(getLoggedUser()));
    }

    if (!prefsLoaded) {
      promises.push(dispatch(getPrefs()));
    }

    return Promise.all(promises);
  },
};

const mapStateToProps = (state) => ({
  loading: state.Account.get('loading') || state.Prefs.get('loading') || state.Topics.get('loading') || state.Stories.get('loading'),
  isAuthenticated: state.Account.toJSON().isAuthenticated,
  overlay: state.Overlay.toJSON(),
});

export default provideHooks(hooks)(connect(mapStateToProps)(App));