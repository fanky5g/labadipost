import React, { Component, PropTypes } from 'react';

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