export function getTopics() {
  return {
    type: 'GET_TOPICS',
    promise: (client) => client.get('/feeds/categories'),
  };
}