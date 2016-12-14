if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import Profile from './children/Profile';

export default function createRoutes(store) {
  /* eslint global-require: "off" */
  return {
    path: 'settings',
    name: 'Account',
    getComponents(location, cb) {
      require.ensure([
        './components/Settings',
      ], (require) => {
        const Settings = require('./components/Settings').default;
        cb(null, Settings);
      });
    },
    indexRoute: {
      name: 'Profile',
      component: Profile,
    }
  };
}
