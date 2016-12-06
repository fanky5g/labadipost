import request from 'axios';

export function getPresidentialCandidates() {
  return {
    type: 'GET_PRESIDENTIAL',
    promise: (client) => client.get('/election2016/prec'),
  };
}

export function getConstituencies() {
  return {
    type: 'GET_CONSTITUENCIES',
    promise: (client) => client.get('/election2016/constituencies?type=Presidential')
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

export function undoResetCount() {
  return {
    type: 'UNDO_RESET_COUNT',
  };
}

function postResults(data) {
  const baseEndpoint = `${process.env.PROTOCOL}://labadipost.com/api/${process.env.API_VERSION}`;
  return request.post(`${baseEndpoint}/election2016/report`, data);
}

// receive live results