import request from 'axios';

export function logoutBackend() {
  return request.post('/api/v1/auth/logout');
}

export function logoutSuccess(data) {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('token');
  }

  return {
    type: 'LOGOUT_SUCCESS',
    res: data,
  };
}

export function logout() {
  return dispatch => {
    logoutBackend().then(
      (data) => {
        if (typeof window !== 'undefined') {
          window.location.reload();
          setTimeout(() => {
            dispatch(logoutSuccess(data));
          }, 2000);
        }
      }
    );
  };
}
