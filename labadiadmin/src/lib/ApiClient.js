import request from 'axios';

const methods = ['get', 'post', 'put', 'patch', 'delete'];

function formatUrl(path) {
  const adjustedPath = `${process.env.PROTOCOL}://labadipost.com/api/${process.env.API_VERSION}${path[0] !== '/' ? '/': ''}${path}`;
  console.log(adjustedPath);
  // Prepend `/api` to relative URL, to proxy to API server.
  return adjustedPath;
}

class _ApiClient {
  constructor(req) {
    methods.forEach((method) => {
      this[method] = (path, { params, data } = {}) => {
        // const request = axios[method](formatUrl(path));

        if (params) {
          request.query(params);
        }

        if (!!window.localStorage.getItem('token')) {
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
