import Immutable from 'immutable';

const defaultState = Immutable.Map({
  loading: false,
  loaded: false,
  cursor: '',
  data: [],
});

const StoriesReducer = (state = defaultState, action) => {
  switch(action.type) {
    case 'GET_STORIES_REQUEST':
      return state.set('loading', true);
    case 'GET_STORIES':
      return state.merge({
        cursor: action.res.data.cursor,
        data: action.res.data.stories,
        loading: false,
        loaded: true,
      });
    case 'GET_STORIES_FAILURE':
      return state.set('loading', false);
    default:
      return state;
  }
};

export default StoriesReducer;