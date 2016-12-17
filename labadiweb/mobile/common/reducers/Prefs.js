import Immutable from 'immutable';

const defaultState = Immutable.Map({
	loading: false,
  loaded: false,
  selectState: false,
  hasPrefs: false,
  prefs: [],
});

const PrefsReducer = (state = defaultState, action) => {
  switch(action.type) {
  	case 'ENABLE_SELECT_STATE':
  	  return state.set('selectState', true);
  	case 'DISABLE_SELECT_STATE':
  	  return state.set('selectState', false);
  	case 'ADD_PREF':
  	  return state.update('prefs', prefs => {
  	  	const newPref = {
  	  	  name: action.name,
	      id: action.id,
	      categoryId: action.categoryId,
  	  	};
  	  	return prefs.concat(newPref);
  	  });
  	case 'REMOVE_PREF':
  	  return state.update('prefs', prefs => 
  	  	prefs.filter(item => item.id !== action.id)
  	  );
  	case 'SAVE_PREFS_LOADING':
  	  return state.set('loading', true);
  	case 'SAVE_PREFS':
  	  return state.merge({
  	  	hasPrefs: true,
  	  	loading: false,
  	  	selectState: false,
  	  });
  	case 'SAVE_PREFS_FAILURE':
  	  return state.set('loading', false);
    case 'GET_PREFS_REQUEST':
      return state.set('loading', true);
    case 'GET_PREFS':
      return state.merge({
        prefs: action.res.data || [],
        loaded: true,
        loading: false,
        hasPrefs: Array.isArray(action.res.data) && action.res.data.length ? true : false,
      });
    case 'GET_PREFS_FAILURE':
      return state.set('loading', false);
  	default:
  	  return state;
  }
};

export default PrefsReducer;