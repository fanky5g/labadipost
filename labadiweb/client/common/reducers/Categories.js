import Immutable from 'immutable';

const defaultState = Immutable.Map({
  data: [],
});

const CategoriesReducer = (state = defaultState, action) => {
  switch(action.type) {
    case 'GET_CATEGORIES':
      console.log(action);
      return state.merge({
        data: action.categories,
      });
    default:
      return state;
  }
};

export default CategoriesReducer;