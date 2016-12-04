import request from 'axios';

export function logoutSuccess() {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');

  return {
    type: 'LOGOUT_SUCCESS',
  };
}

export function logoutUser() {
  return dispatch => {
      dispatch(logoutSuccess());
  }
}
