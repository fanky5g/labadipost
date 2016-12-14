import Immutable from '#node_modules/immutable';

const defaultState = Immutable.Map({
  isWaiting: false,
  user: {},
  shouldRedirect: false,
  redirectLocation: '',
  message: '',
  authSuccess: false,
  bannerLoading: false,
  token: null,
});

const Account = (state = defaultState, action) => {
  switch (action.type) {
    case 'CREATE_ACCOUNT_REQUEST':
      return state.set('isWaiting', true);
    case 'CREATE_ACCOUNT':
      return state.merge({
        isWaiting: false,
        shouldRedirect: true,
        authSuccess: true,
        message: action.res.data.message || 'Successfully created user',
        redirectLocation: 'login',
      });
    case 'CREATE_ACCOUNT_FAILURE':
      return state.merge({
        isWaiting: false,
        authSuccess: false,
        message: action.error.data,
      });
    case 'INITIATE_PASSWORD_RESET_REQUEST':
      return state.merge({
        isWaiting: true,
      });
    case 'INITIATE_PASSWORD_RESET':
    case 'INITIATE_PASSWORD_RESET_FAILURE':
    case 'RESET_PASSWORD_REQUEST':
      return state.merge({
        isWaiting: true,
      });
    case 'RESET_PASSWORD':
    case 'RESET_PASSWORD_FAILURE':
    case 'AUTH_USER_REQUEST':
      return state.merge({
        isWaiting: true,
      });
    case 'AUTH_USER':
    // find better implementation of this
      return state.merge({
        isAuthenticated: true,
        user: action.res.data.user,
        token: action.res.data.token,
        isWaiting: false,
      });
    case 'AUTH_USER_FAILURE':
      return state.merge({
        isWaiting: false,
        authSuccess: false,
        message: action.error.data,
        user: null,
      });
    case 'EDIT_USER_REQUEST':
      return state.merge({
        isWaiting: true,
      });
    case 'EDIT_USER':
      // add edited result object so we can update which fields succeeded
      // if delegate is editing? change
      if (action.res.data.type === 'merchantEditDelegate') {
        return state.withMutations((stateIns2) => {
          stateIns2
            .updateIn(['user', 'roles', 'merchant', 'delegates'], arr => {
              const index = arr.findIndex(item => item.get('_id') === action.res.data.delegate._id);
              return arr.set(index, Immutable.fromJS(action.res.data.delegate));
            })
            .merge({
              token: action.res.data.token,
              message: 'Delegate successfully edited',
              isWaiting: false,
              authSuccess: true,
            });
        });
      }

      return state.merge({
        isAuthenticated: true,
        user: action.res.data.user,
        token: action.res.data.token,
        message: 'Account edited successfully',
        isWaiting: false,
        authSuccess: true,
      });
    case 'EDIT_USER_FAILURE':
      return state.merge({
        message: action.error.data,
        isWaiting: false,
        authSuccess: false,
      });
    case 'DELETE_IMAGE_REQUEST':
      return state.merge({
        isWaiting: true,
      });
    case 'DELETE_IMAGE':
      return state.withMutations((stateIns3) => {
        stateIns3
        .setIn(['user', 'roles', action.res.data.type, 'avatarUrl'], action.res.data.avatar)
        .merge({
          isWaiting: false,
          authSuccess: true,
          message: 'Avatar reset successful',
        });
      });
    case 'DELETE_IMAGE_FAILURE':
      return state.merge({
        isWaiting: false,
        authSuccess: false,
      });
    case 'DELETE_USER_SUCCESS':
      return state.merge({
        isWaiting: false,
      });
    case 'DELETE_USER':
      return state.merge({
        isWaiting: false,
      });
    case 'DELETE_USER_FAILURE':
      return state.merge({
        isWaiting: false,
      });
    case 'LOGOUT_SUCCESS':
      return state.merge({
        user: {},
        isAuthenticated: false,
        token: null,
        message: '',
      });
    case 'CLEAN_AUTH_MESSAGE':
      return state.merge({
        message: '',
        isWaiting: false,
      });
    case 'RECEIVE_SOCKET':
      if (state.get('user')) {
        return state.update('user', obj => obj.set('socketID', action.socketID));
      }
      return state;
    default:
      return state;
  }
};

export default Account;
