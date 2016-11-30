import { createStore, applyMiddleware, compose } from 'redux';
import configurePromise from 'common/middleware/promise';
import createReducers from 'common/reducers/create';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import DevTools from 'common/middleware/DevTools';


export default function create(client, data) {
  const middleware = [configurePromise(client), thunk];

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger());
  }

  const finalCreateStore = compose(
    applyMiddleware(...middleware),
    DevTools.instrument()
  )(createStore);

  const asyncReducers = {};
  const reducers = createReducers(asyncReducers);

  const store = finalCreateStore(reducers, data);

  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('common/reducers/create',
        () => store.replaceReducer(createReducers));
    }
  }

  return store;
}
