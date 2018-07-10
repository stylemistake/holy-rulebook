import { createRouter } from 'router5';
import browserPlugin from 'router5/plugins/browser';
import { router5Middleware } from 'redux-router5';
import _routerReducer from 'redux-router5/immutable/reducer';

export const ROUTES = [
  {
    title: 'Home',
    name: 'index',
    path: '/',
  },
  {
    title: 'Game state',
    name: 'gameState',
    path: '/gamestate/:gameStateId',
  },
  {
    title: 'Character',
    name: 'character',
    path: '/character/:characterId',
  },
  {
    title: 'Aptitudes',
    name: 'character.aptitudes',
    path: '/aptitudes',
  },
  {
    title: 'Characteristics',
    name: 'character.charcs',
    path: '/characteristics',
  },
  {
    title: 'Experience',
    name: 'character.xp',
    path: '/xp',
  },
];

const ROUTER_OPTIONS = {
  defaultRoute: 'home',
};

const router = createRouter(ROUTES, ROUTER_OPTIONS)
  .usePlugin(browserPlugin());


//  Middleware
// --------------------------------------------------------

export function createRouterMiddleware() {
  return router5Middleware(router);
}


//  Reducer
// --------------------------------------------------------

let hasStarted = false;

export function routerReducer(state, action) {
  // Workaround to properly initalize router.
  // Has to be started when Redux store has properly initialized.
  if (!hasStarted) {
    hasStarted = true;
    setTimeout(() => router.start());
  }
  return _routerReducer(state, action);
}


//  Actions
// --------------------------------------------------------

export { actions as routerActions } from 'redux-router5';
