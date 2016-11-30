export function getUsers() {
  return {
    type: 'GET_USERS',
    promise: (client) => client.get('/users'),
  };
}

export function editUsers(fields) {
  return {
    type: 'EDIT_USERS',
    promise: (client) => client.put('/user', {
      data: fields,
    }),
  };
}

export function deleteUser(credentials) {
  return {
    type: 'DELETE_ACCOUNT',
    promise: (client) => client.delete('/user', {
      data: credentials,
    }),
  };
}

export function cleanActionResult() {
  return {
    type: 'CLEAN_ACTION_RESULT',
  };
}
