if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import injectAsyncReducer from 'common/store/injectAsyncReducer';

export default function createRoutes(store) {
  /* eslint global-require: "off" */
  return {
    path: 'categories',
    name: 'Categories',
    getComponents(location, cb) {
      if (process.env.BROWSER) {
        require.ensure([
        './components/Categories',
      ], (require) => {
        const Categories = require('./components/Categories').default;
        const CategoryReducer = require('./reducer').default;
        injectAsyncReducer(store, 'Categories', CategoryReducer);

        cb(null, Categories);
      });
      } else {
        const CategoryReducer = require('./reducer');
        injectAsyncReducer(store, 'Categories', CategoryReducer);
        cb(null, require('./components/Categories').default);
      }
    },
  };
}
