export function getStoriesByTopic(topic, subtopic, subId) {
	return {
		type: 'GET_STORIES_BY_TOPIC',
    promise: (client) => client.get(`/feeds/news?topic=${topic}&sub=${subtopic}&subId=${subId}`),
  };
}