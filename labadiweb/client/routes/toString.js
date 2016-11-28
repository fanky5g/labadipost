import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import createHistory from 'react-router/lib/createMemoryHistory';
import Helmet from 'react-helmet';
import createRoutes from './routes';
import createStore from '#common/store/create';
import Immutable from 'immutable';
import ApiClient from '#lib/ApiClient';

/**
 * Handle HTTP request at Golang server
 *
 * @param   {Object}   options  request options
 * @param   {Function} cbk      response callback
 */
export default function (options, cbk) {
  const useragent = options.headers['User-Agent'];
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(useragent);

  let result = {
    uuid: options.uuid,
    app: null,
    title: null,
    meta: null,
    initial: null,
    error: null,
    redirect: null,
    production: process.env.NODE_ENV === 'production',
  };

  const client = new ApiClient();

  const store = createStore(client, {
    Account: Immutable.Map({
      user: options.claims,
      token: options.token,
      isAuthenticated: options.isAuthenticated,
    }),
    SourceRequest: Immutable.Map({
      location: options.url,
    }),
    Environment: Immutable.Map({
      isMobile: isMobile,
    }),
  });
  const history = createHistory(options.url);
  const routes = createRoutes({store, first: { time: false }});

  try {
    match({ routes, location: options.url }, (error, redirectLocation, renderProps) => {
      try {
        if (error) {
          result.error = error;

        } else if (redirectLocation) {
          result.redirect = redirectLocation.pathname + redirectLocation.search;

        } else {
          result.app = renderToString(
            <Provider store={store}>
              <RouterContext {...renderProps} />
            </Provider>
          );
          const { title, meta } = Helmet.rewind();
          result.title = title.toString();
          result.meta = meta.toString();
          result.initial = JSON.stringify(store.getState());
        }
      } catch (e) {
        result.error = e;
      }
      return cbk(JSON.stringify(result));
    });
  } catch (e) {
    result.error = e;
    return cbk(JSON.stringify(result));
  }
}
