import createReducer from '../reducers/create';

export default function injectAsyncReducer(store, name, asyncReducer) {
  const tempStore = Object.assign(store, {
    asyncReducers: {
      ...store.asyncReducers,
      [name]: asyncReducer,
    },
  });
  // store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(tempStore.asyncReducers));
}
