export default function login(credentials) {
  return {
    type: 'AUTH_ACCOUNT',
    promise: (client) => client.post('/auth', {
      data: credentials,
    }),
  };
}
