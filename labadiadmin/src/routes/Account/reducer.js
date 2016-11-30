import Immutable from 'immutable';

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
      if (action.res.data.type === 'delegate') {
        return state.withMutations((stateIns) => {
          stateIns
            .updateIn(['user', 'roles', 'merchant', 'delegates'],
              arr => arr.concat(action.res.data.delegate))
            .merge({
              isWaiting: false,
              authSuccess: true,
              message:
              `successfully created delegate. username:
               ${action.res.data.username} password: ${action.res.data.password}`,
            });
        });
      }
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
        user: {
          ...action.res.data.user,
          address: action.res.data.user.address.map((address) => ({
            ...address, editable: false,
            isActive: false })),
        },
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
        user: Immutable.fromJS({
          ...action.res.data.user,
          address: action.res.data.user.address.map((address) => Immutable.fromJS({
            ...address,
            editable: true,
            isActive: true,
          })),
        }),
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
    // state setin bring user type from backend
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
        user: null,
        isAuthenticated: false,
        token: null,
        message: action.res.data.message,
      });
    case 'CLEAN_AUTH_MESSAGE':
      return state.merge({
        message: '',
        isWaiting: false,
      });
    case 'CHANGE_SHOP_BANNER_REQUEST':
      return state.set('bannerLoading', true);
    case 'CHANGE_SHOP_BANNER':
      return state.withMutations((stateIns4) => {
        stateIns4.setIn(['user', 'roles', 'merchant'], Immutable.fromJS(action.res.data))
          .merge({
            bannerLoading: false,
          });
      });
    case 'CHANGE_SHOP_BANNER_FAILURE':
      return state.set({
        bannerLoading: false,
      });
    case 'ONBOARD_MERCHANT_REQUEST':
      return state.set('isWaiting', true);
    case 'ONBOARD_MERCHANT':
      return state.withMutations((stateIns4) => {
        stateIns4.updateIn(['user', 'roles', 'merchant'], obj => {
          const edited = obj.toJSON();
          return Immutable.fromJS({ ...edited, merchantAccount: action.res.data });
        })
        .merge({
          isWaiting: false,
          message: 'Merchant Transaction Account created successfully',
          authSuccess: true,
        });
      });
    case 'ONBOARD_MERCHANT_FAILURE':
      return state.merge({
        isWaiting: false,
        message: 'Merchant Transaction Account creation failed',
        authSuccess: false,
      });
    case 'SET_ADDRESS_EDITABLE':
      return state.updateIn(['user', 'address'], arr => {
        const toEdit = arr.get(action.index).toJSON();
        return arr.set(action.index, Immutable.fromJS({ ...toEdit, editable: action.state }));
      });
    case 'EDIT_ADDRESS':
      return state.updateIn(['user', 'address'], arr => {
        const edited = arr.get(action.index).set(action.key, action.value).toJSON();
        return arr.set(action.index, Immutable.fromJS(edited));
      });
    case 'TOGGLE_ADDRESS_ACTIVE':
      return state.updateIn(['user', 'address'], arr => {
        const toEdit = arr.get(action.index).toJSON();
        return arr.set(action.index, Immutable.fromJS({ ...toEdit, isActive: action.state }));
      });
    case 'REVERT_ADDRESS':
      return state.updateIn(['user', 'address'], () => Immutable.fromJS(action.address));
    case 'ADD_ADDRESS':
      return state.updateIn(['user', 'address'], arr => arr.push(Immutable.Map({})));
    case 'TOGGLE_DELEGATE_ADDRESS_ACTIVE':
      return state.updateIn(['user', 'roles', 'merchant', 'delegates'], arr => {
        const activeDelegate = arr.get(action.dIndex).toJSON();
        const address = activeDelegate.address;
        address[action.index].isActive = action.state;
        activeDelegate.address = address;

        return arr.set(action.dIndex, Immutable.fromJS(activeDelegate));
      });
    case 'SET_DELEGATE_ADDRESS_EDITABLE':
      return state.updateIn(['user', 'roles', 'merchant', 'delegates'], arr => {
        const activeDelegate = arr.get(action.dIndex).toJSON();
        const address = activeDelegate.address;
        address[action.index].editable = action.state;
        activeDelegate.address = address;

        return arr.set(action.dIndex, Immutable.fromJS(activeDelegate));
      });
    case 'EDIT_DELEGATE_ADDRESS':
      return state.updateIn(['user', 'roles', 'merchant', 'delegates'], arr => {
        const activeDelegate = arr.get(action.dIndex).toJSON();
        const address = activeDelegate.address;
        address[action.index][action.key] = action.value;
        activeDelegate.address = address;

        return arr.set(action.dIndex, Immutable.fromJS(activeDelegate));
      });
    case 'ADD_DELEGATE_ADDRESS':
      return state.updateIn(['user', 'roles', 'merchant', 'delegates'], arr => {
        const activeDelegate = arr.get(action.dIndex).toJSON();
        const address = activeDelegate.address.push({});
        activeDelegate.address = address;

        return arr.set(action.dIndex, Immutable.fromJS(activeDelegate));
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
