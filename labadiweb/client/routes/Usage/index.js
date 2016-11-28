import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink } from 'react-router';
import { setConfig } from '#common/actions/App';

class Usage extends Component {
  /*eslint-disable */
  static onEnter({ store, nextState, replaceState, callback }) {
    fetch('/api/v1/conf').then((r) => {
      return r.json();
    }).then((conf) => {
      store.dispatch(setConfig(conf));
      callback();
    });
  }

  render() {
    return( 
      <div>
        <Helmet title='Usage' />
        <h2>Usage:</h2>
        <div>
          <span>// TODO: write an article</span>
          <pre>config:
            {JSON.stringify(this.props.config, null, 2)}</pre>
        </div>
        <br />
        go <IndexLink to='/'>home</IndexLink>
      </div>
    );
  }
}

export default connect(store => ({ config: store.config }))(Usage);
