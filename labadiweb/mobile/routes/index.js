if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import React from '#node_modules/react';
import { Route, IndexRoute } from 'react-router';
import App from '#containers/App';

const createRoutes = (store) => {
  const routes = (
    <Route component={App}>
      <Route path="/" getComponents={require('./Home').default(store)} name="Home">
        <Route path="options" getComponents={require('./Preferences').getComponents(store)} name="Preferences" />
      </Route>
      <Route name="Browse" path="browse/:topic" getComponents={require('./Browse').default(store)} />
      <Route name="Page not Found" path="*" getComponents={require('./NotFound').default(store)} />
    </Route>
  );

  return routes;
};

export default createRoutes;