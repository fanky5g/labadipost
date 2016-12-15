import request from 'axios';
import { formatUrl } from '#lib/ApiClient';

export function enableSelectState() {
  return {
    type: 'ENABLE_SELECT_STATE',
  };
};

export function disableSelectState() {
  return {
    type: 'DISABLE_SELECT_STATE',
  };
}

function submitPrefs(prefs) {
  return request.post(formatUrl('/feeds/prefs'), prefs)
}

export function savePrefs(prefs) {
  return dispatch => {
    dispatch({
      type: 'SAVE_PREFS_LOADING',
    });
    submitPrefs(prefs)
      .then(res => {
        dispatch({
          type: 'SAVE_PREFS',
          res: res.body,
        });
      })
      .catch(err => {
        dispatch({
          type: 'SAVE_PREFS_FAILURE',
        });
      });
  };
}
