import React from '#node_modules/react';
import ReactDOM from '#node_modules/react-dom';
import createRoutes from '#routes';
import { Provider } from '#node_modules/react-redux';
import immutifyState from './lib/immutifyState';
import createStore from './common/store/create';
import ApiClient from './lib/ApiClient';
import Router from '#node_modules/react-router/lib/Router';
import browserHistory from '#node_modules/react-router/lib/browserHistory';
import match from '#node_modules/react-router/lib/match';
import useScroll from '#node_modules/scroll-behavior/lib/useStandardScroll';
import { trigger } from '#node_modules/redial';
import { getCookie } from "#lib/cookie";
import { parseQueryString } from '#lib/helpers';

const token = window.localStorage.getItem('token') || 'null';
const user = window.localStorage.getItem('user') || '{}';

let initialState = immutifyState({
  Account: {
    user: JSON.parse(user),
    isAuthenticated: user !== '{}',
    token: JSON.parse(token),
  },
});

const client = new ApiClient();
const history = useScroll(() => browserHistory)();
const store = createStore(client, initialState);
const routes = createRoutes(store);

const { pathname, search, hash } = window.location;
const location = `${pathname}${search}${hash}`;

const { dispatch } = store;
const MOUNT_NODE = document.getElementById('main');

let render = () => {
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    const { components } = renderProps;
    const locals = {
      path: renderProps.location.pathname,
      query: renderProps.location.query,
      params: renderProps.params,
      dispatch,
      client,
      store,
    };

    const component = (
      <Provider store={store}>
        <Router history={history} routes={routes} />
      </Provider>
    );

    // load dependencies for first render since we aren't using ssr
    loadDeps(components, locals);
    ReactDOM.render(component, MOUNT_NODE);
  });

  browserHistory.listen((location) => {
    match({ routes, location }, (error, redirectLocation, renderProps) => {
      const { components } = renderProps;
      const locals = {
        path: renderProps.location.pathname,
        query: renderProps.location.query,
        params: renderProps.params,
        dispatch,
        client,
        store,
      };

      loadDeps(components, locals);
    });
  });
}

function loadDeps(components, locals) {
  var fetch
  if (window.INITIAL_STATE) {
    delete window.INITIAL_STATE;
    fetch = Promise.resolve(true);
  } else {
    fetch = trigger('fetch', components, locals);
  }
  fetch.then(() => {
    return trigger('defer', components, locals); });
}

render();
