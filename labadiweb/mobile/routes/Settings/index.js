if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default function createChildRoutes (store) {
  return function(location, cb) {
    if (process.env.BROWSER) {
      require.ensure([
        './components/Settings',
      ], (require) => {
        const Settings = require('./components/Settings').default;
        cb(null, Settings);
      });
    } else {
      cb(null, require('./components/Settings').default);
    }
  }
}
