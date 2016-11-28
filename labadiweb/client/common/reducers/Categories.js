import Immutable from 'immutable';

const defaultState = Immutable.Map({
  active: '',
  data: [],
});

const CategoriesReducer = (state = defaultState, action) => {
  switch(action.type) {
    case 'SET_CATEGORIES':
      return state.merge({
        data: action.categories,
        active: action.categories[0].name,
      });
    case 'SET_ACTIVE_CATEGORY':
      return state.set('active', action.name);
    default:
      return state;
  }
};

export default CategoriesReducer;