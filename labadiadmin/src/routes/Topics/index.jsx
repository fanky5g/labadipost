if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import injectAsyncReducer from 'common/store/injectAsyncReducer';

export default function createRoutes(store) {
  /* eslint global-require: "off" */
  return {
    path: 'topics',
    name: 'Topics',
    getComponents(location, cb) {
      if (process.env.BROWSER) {
        require.ensure([
        './components/Topics',
      ], (require) => {
        const Topics = require('./components/Topics').default;
        const TopicsReducer = require('./reducer').default;
        injectAsyncReducer(store, 'Topics', TopicsReducer);

        cb(null, Topics);
      });
      } else {
        const TopicsReducer = require('./reducer');
        injectAsyncReducer(store, 'Topics', TopicsReducer);
        cb(null, require('./components/Topics').default);
      }
    },
  };
}
