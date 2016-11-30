import Immutable from 'immutable';

const defaultState = Immutable.Map({
  isLoaded: false,
  enqueued: false,
  actionResult: '',
  actionWaiting: false,
  actionSuccess: false,
  data: [],
});

export default function UsersReducer(state = defaultState, action) {
  switch (action.type) {
    case 'GET_USERS_REQUEST':
      return state.set('actionWaiting', true);
    case 'GET_USERS':
      return state.merge({
        isLoaded: true,
        data: action.res.data,
        actionWaiting: false,
      });
    case 'GET_USERS_FAILURE':
      return state.set('actionWaiting', false);
    case 'EDIT_USERS_REQUEST':
      return state.merge({
        actionWaiting: true,
      });
    case 'EDIT_USERS':
      return state.withMutations((stateInstance) => {
        stateInstance
          .update('data', arr => {
            const index = arr.findIndex(
              item => item.get('_id') === action.res.data.user._id
            );
            return arr.set(index, Immutable.fromJS(action.res.data.user));
          })
          .merge({
            actionResult: 'user edit successfull',
            actionWaiting: false,
            actionSuccess: true,
          });
      });
    case 'EDIT_USERS_FAILURE':
      return state.merge({
        actionResult: action.error.data || '',
        actionWaiting: false,
        actionSuccess: false,
      });
    case 'CLEAN_ACTION_RESULT':
      return state.merge({
        actionResult: '',
        actionWaiting: false,
      });
    default:
      return state;
  }
}
