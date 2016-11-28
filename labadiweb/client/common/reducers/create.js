import { combineReducers } from 'redux';
import * as defaultReducers from '#common/reducers';

export default function createReducer(asyncReducers) {
  return combineReducers({
    ...defaultReducers,
    ...asyncReducers,
  });
}
