import { combineReducers } from '#node_modules/redux';
import * as defaultReducers from './';

export default function createReducer(asyncReducers) {
  return combineReducers({
    ...defaultReducers,
    ...asyncReducers,
  });
}