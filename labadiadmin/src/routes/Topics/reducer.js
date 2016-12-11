import Immutable from 'immutable';

const defaultState = Immutable.Map({
  data: [],
});

const TopicsReducer = (state = defaultState, action) => {
  switch(action.type) {
    case 'GET_TOPICS':
      return state.merge({
        data: action.res.data,
      });
    default:
      return state;
  }
};

export default TopicsReducer;