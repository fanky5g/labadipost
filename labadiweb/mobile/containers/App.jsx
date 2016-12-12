import React, { Component, PropTypes } from '#node_modules/react';
import Icon from '#common/components/Icon';


/* eslint global-require: "off" */
// move this to require.ensure block for root
require('#node_modules/react-mdl/extra/material.min');
// <Icon name="device/ic_access_alarm_24px" className="svg-24px" />

export default class App extends Component {
  getAppStyles = () => {
    return {
      background: '#f7f7f7',
      height: this.getSize().height,
    };
  };

  getSize = () => {
    return document.getElementById("main").getBoundingClientRect();
  };

  render() {
    return (
      <div id="app" className="fill" style={this.getAppStyles()} ref="pageContainer">
        {this.props.children}
      </div>
    );
  }
}