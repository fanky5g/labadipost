import React from './node_modules/react';
import { render } from './node_modules/react-dom';
import { Router, browserHistory } from './node_modules/react-router';
import match from './node_modules/react-router/lib/match';
import useScroll from './node_modules/scroll-behavior/lib/useStandardScroll';
import createRoutes from '#routes';


const history = useScroll(() => browserHistory)();
const { pathname, search, hash } = window.location;
const $location = `${pathname}${search}${hash}`;
const container = document.getElementById('main');

const routes = createRoutes();

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/serviceWorker.js', {
//     scope: '/',
//   });
// }

match({ routes, location: $location }, () => {
  const component = (
    <Router history={history} routes={routes} />
  );

  render(component, container);
});