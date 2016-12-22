import Immutable from 'immutable';

const defaultState = Immutable.Map({
  loading: false,
  loaded: false,
  category: '',
  subtopic: '',
  cursor: '',
  data: [],
});

const BrowseReducer = (state = defaultState, action) => {
  switch(action.type) {
    case 'GET_STORIES_BY_TOPIC_REQUEST':
      return state.set('loading', true);
    case 'GET_STORIES_BY_TOPIC':
      return state.merge({
        cursor: action.res.data.cursor,
        data: action.res.data.stories,
        topic: action.topic,
        subtopic: action.subtopic,
        loading: false,
        loaded: true,
      });
    case 'GET_STORIES_BY_TOPIC_FAILURE':
      return state.set('loading', false);
    default:
      return state;
  }
};

export default BrowseReducer;