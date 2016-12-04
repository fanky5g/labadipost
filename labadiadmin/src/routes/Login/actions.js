export default function login(credentials) {
  return {
    type: 'AUTH_USER',
    promise: (client) => client.post('/auth?admin=true', {
      data: credentials,
    }),
  };
}
