import Immutable from 'immutable';

const defaultState = Immutable.Map({
  data: [],
});

const CategoriesReducer = (state = defaultState, action) => {
  switch(action.type) {
    case 'GET_CATEGORIES':
      return state.merge({
        data: action.res.data,
      });
    default:
      return state;
  }
};

export default CategoriesReducer;