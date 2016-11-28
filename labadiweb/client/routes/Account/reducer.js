import Immutable from 'immutable';

const defaultState = Immutable.Map({
  isAuthenticated: false,
  isWaiting: false,
  user: null,
  shouldRedirect: false,
  redirectLocation: '',
  message: '',
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
        message: action.res.data.message || 'Successfully created user',
        redirectLocation: 'login',
      });
    case 'AUTH_USER_REQUEST':
      return state.merge({
        isWaiting: true,
      });
    case 'AUTH_USER':
    // find better implementation of this
      return state.merge({
        user: action.res.data.user,
      });
    case 'AUTH_USER_FAILURE':
      return state.merge({
        isWaiting: false,
        message: action.error.data,
        user: null,
      });
    case 'EDIT_USER_REQUEST':
      return state.merge({
        isWaiting: true,
      });
    case 'EDIT_USER':
      return state.merge({
        user: action.res.data.user,
        token: action.res.data.token,
        message: 'Account edited successfully',
        isWaiting: false,
      });
    case 'EDIT_USER_FAILURE':
      return state.merge({
        message: action.error.data,
        isWaiting: false,
      });
    case 'LOGOUT_SUCCESS':
      return state.merge({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    case 'CLEAN_AUTH_MESSAGE':
      return state.merge({
        message: '',
        isWaiting: false,
      });
    default:
      return state;
  }
};

export default Account;