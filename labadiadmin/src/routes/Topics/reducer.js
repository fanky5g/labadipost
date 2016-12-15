import Immutable from 'immutable';

const defaultState = Immutable.Map({
  data: [],
});

const TopicsReducer = (state = defaultState, action) => {
  switch(action.type) {
    case 'GET_TOPICS':
      return state.merge({
        data: action.res.data.map(cat => {
          const subs = cat.subcategories.map(subcat => {
            return Object.assign(subcat, {isUpdating: false});
          });
          cat.subcategories = subs;
          return cat;
        }),
      });
    case 'UPDATE_SUBCAT_IMAGE_LOADING':
      return state.update('data', arr => {
        return arr.update(arr.findIndex((item) => {
          return item.get('id') == action.parentId;
        }), cat => cat.update('subcategories', subcat =>
          subcat.update(subcat.findIndex(sub =>
            sub.get('id') === action.id
          ), s => s.set('isUpdating', true))
        ));
      });
    case 'UPDATE_SUBCAT_IMAGE':
      return state.update('data', arr => {
        return arr.update(arr.findIndex((item) => {
          return item.get('id') == action.parentId;
        }), cat => cat.update('subcategories', subcat =>
          subcat.update(subcat.findIndex(sub =>
            sub.get('id') === action.id
          ), s => s.merge({
            isUpdating: false,
            image: action.imgSrc,
          }))
        ));
      });
    case 'UPDATE_SUBCAT_IMAGE_FAILED':
      return state.update('data', arr => {
        return arr.update(arr.findIndex((item) => {
          return item.get('id') == action.parentId;
        }), cat => cat.update('subcategories', subcat =>
          subcat.update(subcat.findIndex(sub =>
            subcat.id === action.id
          ), s => s.set('isUpdating', false))
        ));
      });
    default:
      return state;
  }
};

export default TopicsReducer;