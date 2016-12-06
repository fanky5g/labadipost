import request from 'axios';

export function getParliamentaryCandidates() {
  return {
    type: 'GET_PARLIAMENTARY',
    promise: (client) => client.get('/election2016/parlc'),
  };
}

export function getConstituencies() {
  return {
    type: 'GET_CONSTITUENCIES',
    promise: (client) => client.get('/election2016/constituencies?type=Parliamentary')
  }
}

export function submitResult(data) {
  return dispatch => {
    postResults(data)
      .then(res => {
        dispatch({type: 'SUBMIT_RESULT_SUCCESS', data: {
          success: true,
          type: data.type,
          constituency: data.constituency,
        }})
      })
      .catch(err => dispatch({type: 'SUBMIT_RESULT_FAILURE', error: err}))
  }
}

function postResults(data) {
  return request.post('/election2016/report', {
    data: data,
  });
}

// receive live results