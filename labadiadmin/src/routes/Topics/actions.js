import request from 'axios';

export function getTopics() {
  return {
    type: 'GET_TOPICS',
    promise: (client) => client.get('/feeds/categories'),
  };
}

export function updateSubcategoryImage(data, id, parentId) {
  return dispatch => {
    dispatch({
      type: 'UPDATE_SUBCAT_IMAGE_LOADING',
    });
    request
      .post('http://images.labadipost.com/upload', data)
      .then(response => {
        updateSubcat(id, response.data)
          .then(doneResponse => {
            dispatch({
              type: 'UPDATE_SUBCAT_IMAGE',
              id: id,
              imgSrc: response.data.url,
              parentId: parentId,
            });
          });
      })
      .catch(err => {
        dispatch({
          type: 'UPDATE_SUBCAT_IMAGE_FAILURE',
        });
      });
  };
}

function updateSubcat(id, data) {
  const dataToPost = {
    id: id,
    image: data,
  };
  return request.put('http://labadipost.com/api/v1/feeds/subcategory', dataToPost);
}