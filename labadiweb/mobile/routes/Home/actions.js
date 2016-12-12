export function getStories() {
  return {
    type: 'GET_STORIES',
    promise: (client) => client.get('/feeds/news'),
  };
}