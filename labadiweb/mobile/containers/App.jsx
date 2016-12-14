import React, { Component, PropTypes } from '#node_modules/react';
import Icon from '#common/components/Icon';
import { constructOv, disposeOv, replaceOv } from '#common/actions/Overlay';
import Login from '#routes/Login';
import OverlayComponent from '#common/components/OverlayComponent';
import { connect } from '#node_modules/react-redux';


/* eslint global-require: "off" */
// move this to require.ensure block for root
require('#node_modules/react-mdl/extra/material.min');
// <Icon name="device/ic_access_alarm_24px" className="svg-24px" />

class App extends Component {
  getAppStyles = () => {
    return {
      background: '#f7f7f7',
      height: this.getSize().height,
    };
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
              <span>
                logo
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

  getSize = () => {
    return document.getElementById("main").getBoundingClientRect();
  };

  render() {
    const {isAuthenticated, overlay: { ovActive, ovComponent, ovProps}} = this.props;

    return (
      <div id="app" className="fill" style={this.getAppStyles()} ref="pageContainer">
        {ovActive && <OverlayComponent component={ovComponent} isActive={ovActive} props={ovProps} dispose={this.disposeOverlay} />}
        {
          React.cloneElement(this.props.children, {
            goToLogin: this.goToLogin,
            isAuthenticated: isAuthenticated,
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Account.toJSON().isAuthenticated,
  overlay: state.Overlay.toJSON(),
});

export default connect(mapStateToProps)(App);