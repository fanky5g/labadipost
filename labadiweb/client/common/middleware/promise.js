import { logoutUser } from '../actions/Auth';
import AppLoading from '../../lib/appLoading';

// tap into xhr requests...show app loading effect
export default function promiseMiddleware(client) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { promise, type, ...rest } = action;

    if (!promise) return next(action);

    let IAppLoading;
    if (process.env.BROWSER) {
      IAppLoading = new AppLoading();
      IAppLoading.start();
    }

    const SUCCESS = type;

    const REQUEST = `${type}_REQUEST`;
    const FAILURE = `${type}_FAILURE`;

    next({ ...rest, type: REQUEST });

    const actionPromise = promise(client);
    actionPromise
      .then(
        (res) => {
          if (process.env.BROWSER) IAppLoading.stop();
          next({ ...rest, res, type: SUCCESS });
        },
        (error) => {
          if (process.env.BROWSER) IAppLoading.stop();
          if (error.status === 403) {
            dispatch(logoutUser());
          }
          next({ ...rest, error, type: FAILURE });
        }
      )
      .catch(error => {
        if (process.env.BROWSER) IAppLoading.stop();
        if (error.status === 403) {
          dispatch(logoutUser());
        }
        return next({ ...rest, error, type: FAILURE });
      });
    return actionPromise;
  };
}
