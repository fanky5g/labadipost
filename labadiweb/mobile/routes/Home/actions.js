export function getStories() {
  return {
    type: 'GET_STORIES',
    promise: (client) => client.get('/feeds/news'),
  };
}

export function likeStory(id) {
  return (dispatch, getState) => {
    const user = getState().Account.get('user');
    const uid = user.get('id');
    dispatch(like(id, uid));
  };
}

function like(id, uid) {
  return {
  	type: 'LIKE',
  	promise: (client) => client.post('/feeds/like', {
  	  data: {
  	  	id: id,
  	  	uid: uid,
  	  },
  	})
  };
}

export function bookmarkStory(id) {
  return (dispatch, getState) => {
    const { user } = getState().Account.get('user');
    const uid = user.get('id');
    dispatch(bookmark(id, uid));
  };
}

function bookmark() {
  return {
  	type: 'BOOKMARK',
  	promise: (client) => client.post('/feeds/bookmark', {
  	  data: {
  	  	id: id,
  	  	uid: uid,
  	  },
  	})
  };
}