import Immutable from 'immutable';

const defaultState = Immutable.Map({
  loading: false,
  parliamentaryLoaded: false,
  constituenciesLoaded: false,
  constituencies: [],
  data: [],
  message: '',
});

const ParliamentaryReducer = (state = defaultState, action) => {
  switch(action.type) {
    case 'GET_PARLIAMENTARY_REQUEST':
      return state.set('loading', true);
    case 'GET_PARLIAMENTARY':
      return state.merge({
        loading: false,
        data: action.res.data,
        parliamentaryLoaded: true,
      });
    case 'GET_PARLIAMENTARY_FAILURE':
      return state.merge({
        loading: false,
        message: 'Failed to get parliamentary candidates info',
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
      return state.withMutations((stateObject) => {
        stateObject.update('data', arr => {
          const entries = arr.filter((item) => {
            return item.constituency !== action.constituency;
          });

          return entries;
        })
        .update('constituencies', arr => arr.filter(item => item.get('name') !== action.data.constituency));
      });
      return ;
    case 'SUBMIT_RESULT_FAILURE':
      console.log(action.error.data);
      return state.set('message', 'Results failed to submit')
    default:
      return state;
  }
};

export default ParliamentaryReducer;

//receive election updates