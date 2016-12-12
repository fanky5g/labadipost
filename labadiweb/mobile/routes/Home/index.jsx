if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default function createChildRoutes (store) {
  return function(location, cb) {
    if (process.env.BROWSER) {
      require.ensure([
        './components/HomeLayout',
      ], (require) => {
        const Home = require('./components/HomeLayout').default;
        cb(null, Home);
      });
    } else {
      cb(null, require('./components/HomeLayout').default);
    }
  }
}