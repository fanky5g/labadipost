import Immutable from 'immutable';

const defaultState = Immutable.Map({
  cursor: '',
  data: [],
});

const StoriesReducer = (state = defaultState, action) => {
  switch(action.type) {
    case 'SET_STORIES':
      return state.merge({
        cursor: action.cursor,
        data: action.stories,
      });
    default:
      return state;
  }
};

export default StoriesReducer;