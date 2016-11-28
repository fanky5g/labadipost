import request from 'axios';

const methods = ['get', 'post', 'put', 'patch', 'delete'];

function formatUrl(path) {
  const adjustedPath = path[0] !== '/api' ? `/api${path}` : path;
  // Prepend `/api` to relative URL, to proxy to API server.
  return adjustedPath;
}

class _ApiClient {
  constructor() {
    methods.forEach((method) => {
      this[method] = (path, { params, data } = {}) => {
        // const request = axios[method](formatUrl(path));

        if (params) {
          request.query(params);
        }

        if (process.env.BROWSER && !!window.localStorage.getItem('token')) {
          request.defaults.headers.common.Authorization =
            `Bearer ${JSON.parse(window.localStorage.getItem('token'))}`;
        }
        return request[method](formatUrl(path), data);
      };
    });
  }
}

const ApiClient = _ApiClient;

export default ApiClient;
