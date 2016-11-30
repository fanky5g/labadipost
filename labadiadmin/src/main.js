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

const initialState = immutifyState(window.__INITIAL_STATE__);

const client = new ApiClient();
// const _AppLoading = new AppLoading();
const history = useScroll(() => browserHistory)();
const store = createStore(client, initialState);
const routes = createRoutes(store);

const { dispatch } = store;
const { pathname, search, hash } = window.location;
const $location = `${pathname}${search}${hash}`;
const MOUNT_NODE = document.getElementById('App');

let render = () => {
  match({ routes, location: $location }, () => {
    const component = (
      <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>
    );

    ReactDOM.render(component, MOUNT_NODE);
  });

  browserHistory.listen(() => {
    // dispatch route changing //pageTransitioning
    // _AppLoading.start();
    match({ routes, location: $location }, (error, redirectLocation, renderProps) => {
      const { components } = renderProps;
      const locals = {
        path: renderProps.location.pathname,
        query: renderProps.location.query,
        params: renderProps.params,
        dispatch,
        client,
        store,
      };

      // dispatch route changed: pageTransitioning false
      // _AppLoading.stop();
      if (window.__INITIAL_STATE__) {
        delete window.__INITIAL_STATE__;
      } else {
        trigger('fetch', components, locals);
      }
      trigger('defer', components, locals);
    });
  });
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