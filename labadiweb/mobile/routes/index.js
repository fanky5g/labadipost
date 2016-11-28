import React from 'react';
import { Route, IndexRoute } from '#node_modules/react-router';
import App from '#containers/App';
import Home from '#routes/Home';

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} name="Home" />
  </Route>
);

export default routes;