import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import toString from './toString';
import createRoutes from '#routes/routes';
import { Promise } from 'when';
import createStore from '#common/store/create';
import match from 'react-router/lib/match';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import immutifyState from '#lib/immutifyState';
import ApiClient from '#lib/ApiClient';


export function run() {
  // init promise polyfill
  window.Promise = window.Promise || Promise;
  // init fetch polyfill
  window.self = window;
  require('whatwg-fetch');

  const initialState = immutifyState(window.__INITIAL_STATE__);
  const history = useScroll(() => browserHistory)();
  const { pathname, search, hash } = window.location;
  const $location = `${pathname}${search}${hash}`;
  const container = document.getElementById('app');
  const client = new ApiClient();

  const store = createStore(client, initialState);
  let routes = createRoutes({ store, first: { time: true } });

  match({ routes, location: $location }, () => {
    const component = (
      <Provider store={store}>
        <Router history={history} routes={routes} />
      </Provider>
    );

    render(component, container);
  });
}

// Export it to render on the Golang sever, keep the name sync with -
// https://github.com/olebedev/go-starter-kit/blob/master/src/app/server/react.go#L65
export const renderToString = toString;

require('../styles');

if (module.hot) {
  const reporter = window.__webpack_hot_middleware_reporter__;
  const success = reporter.success;
  reporter.success = function () {
    document.querySelectorAll('link[href][rel=stylesheet]').forEach((link) => {
      const nextStyleHref = link.href.replace(/(\?\d+)?$/, `?${Date.now()}`);
      link.href = nextStyleHref;
    });
    success();
  };
}