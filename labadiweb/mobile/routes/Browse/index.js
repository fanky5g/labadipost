if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import injectAsyncReducer from '#common/store/injectAsyncReducer';

export default function createChildRoutes (store) {
  return function(location, cb) {
    if (process.env.BROWSER) {
      require.ensure([
        './components/Browse',
        './reducer',
      ], (require) => {
        const Browse = require('./components/Browse').default;
        const reducer = require('./reducer').default;
        injectAsyncReducer(store, 'Browse', reducer);
        cb(null, Browse);
      });
    } else {
      const reducer = require('./reducer').default;
      injectAsyncReducer(store, 'Browse', reducer);
      cb(null, require('./components/Browse').default);
    }
  }
}