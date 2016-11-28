import Immutable from 'immutable';

const initialState = Immutable.Map({
  ovActive: false,
  ovComponent: {},
  ovProps: {},
});

export default function Overlay(state = initialState, action) {
  switch (action.type) {
    case 'DISPOSE_OVERLAY':
      return state.merge({
        ovActive: false,
        ovComponent: {},
        ovProps: {},
      });
    case 'CONSTRUCT_OVERLAY':
      return state.merge({
        ovComponent: action.component,
        ovProps: action.props || {},
        ovActive: true,
      });
    case 'REPLACE_OVERLAY':
      return state.merge({
        ovComponent: action.component,
        ovProps: action.props || {},
      });
    default:
      return state;
  }
}
