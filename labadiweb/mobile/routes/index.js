if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import React from '#node_modules/react';
import { Route, IndexRoute } from 'react-router';
import App from '#containers/App';

const createRoutes = (store) => {
  const routes = (
    <Route component={App}>
      <Route path="/" getComponents={require('./Home').default(store)} name="Home"></Route>
      <Route name="Page not Found" path="*" getComponents={require('./NotFound').default(store)} />
    </Route>
  );

  return routes;
};

export default createRoutes;