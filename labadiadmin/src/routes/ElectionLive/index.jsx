if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import Broadcast from './children/Broadcast';

export default function createRoutes(store) {
  /* eslint global-require: "off" */
  return {
    path: 'electionlive',
    name: 'Election2016',
    getComponents(location, cb) {
      require.ensure([
        './components/Election',
      ], (require) => {
        const Election = require('./components/Election').default;
        cb(null, Election);
      });
    },
    getChildRoutes(location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          require('./children/Presidential').default(store),
          require('./children/Parliamentary').default(store),
        ]);
      });
    },
    indexRoute: {
      name: 'Broadcast',
      component: Broadcast,
    },
  };
}