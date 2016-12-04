import React, { Component, PropTypes } from 'react';
import Home from './components/Home';

export default class RootComponent extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    canvasActive: true,
    nestedRouteActive: false,
  };

  getTransitionStyle = () => {
    const { canvasActive } = this.state;

    const size = this.getSize();
    let translateTo = 0;

    const baseTransision = (to) => ({
      position: 'absolute',
      left: '0px',
      top: '0px',
      bottom: '0px',
      right: '0px',
      transitionProperty: 'transform',
      transitionDuration: '380ms',
      transform: `translate(0px, ${to}px) scale(1, 1)`,
    });

    if (canvasActive) {
      translateTo = size.height - 48;
      this.setState({
       canvasActive: false,
      });
      return baseTransision(translateTo);
    }

    if (!canvasActive) {
      this.setState({
       canvasActive: true,
      });
      return baseTransision(translateTo);
    }
  }

  getAppStyles = () => {
    return {
      background: '#f7f7f7',
      height: this.getSize().height,
    };
  };

  getBoundStyle = () => {
    return {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    };
  };

  getSize = () => {
    return document.getElementById("main").getBoundingClientRect();
  };

  toggleClearCanvas = () => {
    const { canvasActive, nestedRouteActive } = this.state;
    const canvasSurface = document.getElementById("surface");
    Object.assign(canvasSurface.style, this.getTransitionStyle());

    if (!canvasActive) {
      setTimeout(() => {
        canvasSurface.removeAttribute('style');
      }, 380);
    }
  };

  visitNestedRoute = (name) => {
    const { canvasActive } = this.state;
    const { router } = this.context;

    if (canvasActive) {
      this.toggleClearCanvas();
      this.setState({ nestedRouteActive: true});
      router.push(name);
    } else {
      // we are already in navigated state, bring canvas back to live
      this.toggleClearCanvas();
      this.setState({ nestedRouteActive: false });
      router.goBack();
    }
  };

  render() {
    const { nestedRouteActive } = this.state;

    return (
      <div id="app" className="fill" style={this.getAppStyles()} ref="pageContainer">
        {
          nestedRouteActive &&
          <div className="fill">
            {this.props.children}
          </div>
        }
        <div className="fill" id="surface">
          <div style={this.getBoundStyle()}>
            <div className="fill">
              <Home goToURL={this.visitNestedRoute} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}