export function getTopics() {
  return {
    type: 'GET_TOPICS',
    promise: (client) => client.get('/feeds/categories')
  };
}

export function setOption(option) {
  return {
    type: 'SET_OPTION',
    option: option,
  };
}

function findSubcategory(topics, id, parentId) {
  let subcategory;
  const parent = topics.find(item => {
  	return item.id == parentId;
  });

  if (parent) {
  	const subcategories = parent.subcategories || [];
    subcategory = subcategories.find(item => {
      return item.id == id;
    });
    return subcategory;
  }
  return subcategory;
}

export function selectItem(id, parentId) {
  return (dispatch, getState) => {
    const { data } = getState().Topics.toJSON();
    const subcategory = findSubcategory(data, id, parentId);

    if (subcategory && !subcategory.selected) {
      dispatch({
      	type: 'SELECT_SUBCATEGORY',
      	id: id,
      	parentId: parentId,
      });
      // add to prefs
      dispatch({
      	type: 'ADD_PREF',
      	name: subcategory.type,
      	id: id,
      	categoryId: parentId,
      });
    } else if (subcategory && subcategory.selected) {
      dispatch({
      	type: 'DESELECT_SUBCATEGORY',
      	id: id,
      	parentId: parentId,
      });
      // remove from prefs
      dispatch({
      	type: 'REMOVE_PREF',
      	id: id,
      });
    }
  };
}
