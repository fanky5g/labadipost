export function getTopics() {
  return {
    type: 'GET_TOPICS',
    promise: (client) => client.get('/feeds/categories')
  };
}

export function setOption(option) {
  return {
    type: 'SET_OPTION',
    option: option,
  };
}
