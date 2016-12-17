import request from '#node_modules/axios';
import { formatUrl } from '#lib/ApiClient'; 

function getUser() {
  return request.get(formatUrl('/auth/user'));
}

export function getLoggedUser() {
  return dispatch => {
    getUser()
    .then(response => {
      const { user, token } = response.data;
      window.localStorage.setItem("user", JSON.stringify(user));
      window.localStorage.setItem("token", JSON.stringify(token));

      dispatch({
        type: 'GET_USER',
        user: user,
        token: token,
      });
    })
    .catch(err => {
      dispatch({
        type: 'GET_USER_FAILURE',
      });
    })
  };
}

export function create(user) {
  return {
    type: 'CREATE_ACCOUNT',
    promise: (client) => client.post('/user', {
      data: user,
    }),
  };
}

export function resetPass(email) {
  return {
    type: 'INITIATE_PASSWORD_RESET',
    promise: (client) => client.post('/resetpass', {
      data: email,
    }),
  };
}

export function verifyPasswordRet(credentials) {
  return {
    type: 'RESET_PASSWORD',
    promise: (client) => client.post(`/resetpass/${credentials.id}/${credentials.token}`),
  };
}

export function edit(fields) {
  return {
    type: 'EDIT_ACCOUNT',
    promise: (client) => client.put('/user', {
      data: fields,
    }),
  };
}

export function clearMessage() {
  return {
    type: 'CLEAR_AUTH_MESSAGE',
  };
}
