if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import injectAsyncReducer from 'common/store/injectAsyncReducer';

export default function createRoutes(store) {
  return {
    path: 'parliamentary',
    name: 'Parliamentary',
    getComponents(location, cb) {
      require.ensure([
        './components/Parliamentary',
      ], (require) => {
        const ParliamentaryPage = require('./components/Parliamentary').default;
        const reducer = require('./reducer').default;
        injectAsyncReducer(store, 'Parliamentary', reducer);
        cb(null, ParliamentaryPage);
      });
    },
  };
}
