import Immutable from 'immutable';

const defaultState = Immutable.Map({
  loading: false,
  data: [],
  loaded: false,
});

const TopicsReducer = (state = defaultState, action) => {
  switch(action.type) {
  	case 'GET_TOPICS_LOADING':
  	  return state.set('loading', true);
  	case 'GET_TOPICS':
  	  return state.merge({
  	  	loading: false,
  	  	data: action.res.data,
  	  	loaded: true,
  	  });
  	case 'GET_TOPICS_FAILURE':
  	  return state.set('loading', false);
  	default:
  	  return state;
  }
};

export default TopicsReducer;