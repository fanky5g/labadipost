import request from 'axios';

export function logoutBackend() {
  return request.post('/logout');
}

export function logoutSuccess(data) {
  window.localStorage.removeItem('token');

  return {
    type: 'LOGOUT_SUCCESS',
    res: data,
  };
}

export function logout() {
  return dispatch => {
    logoutBackend().then(
      (data) => {
        dispatch(logoutSuccess(data));
        window.location.replace('/');
        // @todo::clear user contents from all reducers
      }
    );
  };
}
