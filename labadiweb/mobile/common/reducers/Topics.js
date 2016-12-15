import Immutable from 'immutable';

const defaultState = Immutable.Map({
  loading: false,
  option: 'agency',
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
    case 'SET_OPTION':
      return state.set('option', action.option);
    case 'SELECT_SUBCATEGORY':
      return state.update('data', arr => {
        return arr.update(arr.findIndex((item) => {
          return item.get('id') == action.parentId;
        }), cat => cat.update('subcategories', subcat =>
          subcat.update(subcat.findIndex(sub =>
            sub.get('id') === action.id
          ), s => s.set('selected', true))
        ));
      });
    case 'DESELECT_SUBCATEGORY':
      return state.update('data', arr => {
        return arr.update(arr.findIndex((item) => {
          return item.get('id') == action.parentId;
        }), cat => cat.update('subcategories', subcat =>
          subcat.update(subcat.findIndex(sub =>
            sub.get('id') === action.id
          ), s => s.set('selected', false))
        ));
      });
  	default:
  	  return state;
  }
};

export default TopicsReducer;