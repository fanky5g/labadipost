if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import injectAsyncReducer from 'common/store/injectAsyncReducer';

export default function createRoutes(store) {
  return {
    path: 'presidential',
    name: 'Presidential',
    getComponents(location, cb) {
      require.ensure([
        './components/Presidential',
      ], (require) => {
        const Presidential = require('./components/Presidential').default;
        const reducer = require('./reducer').default;
        injectAsyncReducer(store, 'Presidential', reducer);
        cb(null, Presidential);
      });
    },
  };
}
