import Immutable from 'immutable';

const defaultState = Immutable.Map({
  loading: false,
  presidentialLoaded: false,
  constituenciesLoaded: false,
  constituencies: [],
  data: [],
  message: '',
});

const PresidentialReducer = (state = defaultState, action) => {
  switch(action.type) {
    case 'GET_PRESIDENTIAL_REQUEST':
      return state.set('loading', true);
    case 'GET_PRESIDENTIAL':
      return state.merge({
        loading: false,
        presidential: action.res.data,
      });
    case 'GET_PRESIDENTIAL_FAILURE':
      return state.merge({
        loading: false,
        message: 'Failed to get presidential candidate info',
      });
    case 'GET_CONSTITUENCIES_REQUEST':
      return state.set('loading', true);
    case 'GET_CONSTITUENCIES':
      return state.merge({
        loading: false,
        constituencies: action.res.data,
        constituenciesLoaded: true,
      });
    case 'GET_CONSTITUENCIES_FAILURE':
      console.log(action.error.data);
      return state.merge({
        loading: false,
        message: 'Failed to get constituencies',
      });
    case 'SUBMIT_RESULT_SUCCESS':
      return state.update(action.type, arr => {
        const entries = array.filter((item) => {
          return item.constituency !== action.constituency;
        });

        return entries;
      });
    case 'SUBMIT_RESULT_FAILURE':
      return state.set('message', action.error.data)
    default:
      return state;
  }
};

export default PresidentialReducer;

//receive election updates