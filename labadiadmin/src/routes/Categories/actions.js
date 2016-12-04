export function getCategories() {
  return {
    type: 'GET_CATEGORIES',
    promise: (client) => client.get('/feeds/categories'),
  };
}