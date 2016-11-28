import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import App from '#containers/App';
import Homepage from '#routes/Home';
import Usage from '#routes/Usage';
import NotFound from '#routes/NotFound';
import Login from '#routes/Login';

/**
 * Returns configured routes for different
 * environments. `w` - wrapper that helps skip
 * data fetching with onEnter hook at first time.
 * @param {Object} - any data for static loaders and first-time-loading marker
 * @returns {Object} - configured routes
 */
const createRoutes = ({ store, first }) => {
  // Make a closure to skip first request
  function w(loader) {
    return (nextState, replaceState, callback) => {
      if (first.time) {
        first.time = false;
        return callback();
      }
      return loader ? loader({ store, nextState, replaceState, callback }) : callback();
    };
  }

  return (
    <Route path="/" component={App}>
     <IndexRoute component={Homepage} name="Home" onEnter={w(Homepage.onEnter)}/>
     <Route path="/usage" name="Usage" component={Usage} onEnter={w(Usage.onEnter)}/>
     {/* Server redirect in action */}
     <Redirect from="/docs" to="/usage" />
     <Route path="*" component={NotFound} name="Page not found" onEnter={w(NotFound.onEnter)}/>
   </Route>
  );
};

export default createRoutes;
