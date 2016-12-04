import React from 'react';
import ReactDOM from 'react-dom';
import createRoutes from 'routes';
import { Provider } from 'react-redux';
import immutifyState from 'lib/immutifyState';
import createStore from 'common/store/create';
import ApiClient from 'lib/ApiClient';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import match from 'react-router/lib/match';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import { trigger } from 'redial';
// import AppLoading     from 'lib/appLoading';

const token = window.localStorage.getItem('token');
const user = window.localStorage.getItem('user');
let initialState = {};
if (user) {
  const state = {
    Account: {
      user: JSON.parse(user),
      isAuthenticated: true,
      token: JSON.parse(token),
    },
  };

  initialState = immutifyState(state);
}

const client = new ApiClient();
const history = useScroll(() => browserHistory)();
const store = createStore(client, initialState);
const routes = createRoutes(store);

const { pathname, search, hash } = window.location;
const location = `${pathname}${search}${hash}`;

const { dispatch } = store;
const MOUNT_NODE = document.getElementById('App');

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
  fetch.then(() => { return trigger('defer', components, locals); });
}

if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

render();