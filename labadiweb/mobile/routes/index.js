import React from 'react';
import { Route, IndexRoute } from '#node_modules/react-router';
import App from '#containers/App';
import Home from '#routes/Home';
import Settings from '#routes/Settings';

const createRoutes = (store) => {
  const routes = (
    <Route component={App}>
      <Route path="/" component={Home} name="Home">
        <Route path="settings" getComponents={require('./Settings').default()} name="Preferences" />
      </Route>
      <Route name="Page not Found" path="*" getComponents={require('./NotFound').default()} />
    </Route>
  );

  return routes;
};

export default createRoutes;