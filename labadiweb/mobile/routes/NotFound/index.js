if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default function getComponents (store) {
  return function(location, cb) {
    if (process.env.BROWSER) {
      require.ensure([
        './components/NotFound',
      ], (require) => {
        const NotFoundRoute = require('./components/NotFound').default;
        cb(null, NotFoundRoute);
      });
    } else {
      cb(null, require('./components/NotFound').default);
    }
  }
}