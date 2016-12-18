if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
// import injectAsyncReducer from '../../common/store/injectAsyncReducer';

export function getComponents(store) {
  return function(location, cb) {
    require.ensure([
      './components/Preferences',
    ], (require) => {
      const Prefs = require('./components/Preferences').default;
      cb(null, Prefs);
    });
  }
}

// export function createChildRoutes (store) {
//   return function(location, cb) {
//     require.ensure([], (require) => {
//       cb(null, [
//         require('./children/Presidential').default(store),
//         require('./children/Parliamentary').default(store),
//       ]);
//     });
//   }
// }