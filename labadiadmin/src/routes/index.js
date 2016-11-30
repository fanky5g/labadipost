if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import App from 'containers/App';
import Overview from 'routes/Overview';

const createRoutes = (store) => {
  /* eslint global-require: "off" */
  const root = [{
    path: '/',
    component: App,
    getChildRoutes(location, cb) {
      if (process.env.BROWSER) {
        require.ensure([], (require) => {
          cb(null, [
            // require('./Account').default,
            // require('./Contact').default,
            // require('./Users').default,
            require('./NotFound').default(store),
          ]);
        });
      } else {
        cb(null, [
          // require('./Account').default,
          // require('./Contact').default,
          // require('./Users').default,
          require('./NotFound').default(store),
        ]);
      }
    },
    indexRoute: {
      name: 'Overview',
      component: Overview,
    },
  }];

  return root;
};

export default createRoutes;
