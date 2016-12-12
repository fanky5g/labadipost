import { createStore, applyMiddleware, compose } from '#node_modules/redux';
import createReducers from '../reducers/create';
import configurePromise from '../middleware/promise';
import thunk from '#node_modules/redux-thunk';


export default function create(client, data) {
  const middleware = [configurePromise(client), thunk];

  const finalCreateStore = compose(
    applyMiddleware(...middleware),
  )(createStore);

  const asyncReducers = {};
  const reducers = createReducers(asyncReducers);

  const store = finalCreateStore(reducers, data);

  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('#common/reducers/create',
        () => store.replaceReducer(createReducers));
    }
  }

  return store;
}