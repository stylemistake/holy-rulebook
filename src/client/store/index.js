//  Constants
// --------------------------------------------------------

export { ROUTES } from './router.js';


//  Actions
// --------------------------------------------------------

// Importing actions
import * as characterActions from './characterActions.js';
import * as gameStateActions from './gameStateActions.js';
import * as globalActions from './globalActions.js';
import * as persistenceActions from './persistenceActions.js';
import { routerActions } from './router.js';

// Exporting actions together
export const actions = {
  ...characterActions,
  ...gameStateActions,
  ...globalActions,
  ...persistenceActions,
};

// Exporting actions separately
export { characterActions }
export { gameStateActions }
export { globalActions }
export { persistenceActions }
export { routerActions }


//  Selectors
// --------------------------------------------------------

// Importing selectors
import * as characterSelectors from './characterSelectors.js';
import * as gameStateSelectors from './gameStateSelectors.js';
import * as globalSelectors from './globalSelectors.js';

// Exporting selectors together
export const selectors = {
  ...characterSelectors,
  ...gameStateSelectors,
  ...globalSelectors,
};

// Exporting selectors separately
export { characterSelectors }
export { gameStateSelectors }
export { globalSelectors }


//  Reducers
// --------------------------------------------------------

// Importing reducers
import { globalReducer, updatedAtReducer } from './global.js';
import { characterReducer } from './character.js';
import { gameStateReducer } from './gameState.js';
import { persistenceReducer } from './persistence.js';
import { relayReducer } from './relay.js';
import { rulebookReducer } from './rulebook.js';
import { routerReducer } from './router.js';

// Export all reducers as one reducer
export function createReducer() {
  return composeReducers([
    // This reducer
    globalReducer,
    // Namespaced reducers
    combineReducers({
      router: routerReducer,
    }),
    // Other reducers
    characterReducer,
    gameStateReducer,
    persistenceReducer,
    relayReducer,
    rulebookReducer,
    // Meta reducers
    updatedAtReducer,
  ]);
}


//  Middlewares
// --------------------------------------------------------

import thunkMiddleware from 'redux-thunk';
import { createLoggerMiddleware } from './logger.js';
import { createPersistenceMiddleware } from './persistence.js';
import { createRelayMiddleware } from './relay.js';
import { createRouterMiddleware } from './router.js';
import { createRulebookMiddleware } from './rulebook.js';
import { createSemaphoreMiddleware } from './semaphore.js';

// Export middlewares as a store enhancer
export function createEnhancer() {
  const middlewares = [
    thunkMiddleware,
    createLoggerMiddleware(),
    createPersistenceMiddleware(),
    createRelayMiddleware(),
    createRouterMiddleware(),
    createRulebookMiddleware(),
    createSemaphoreMiddleware(),
  ];
  return applyMiddleware(...middlewares);
}


//  Utility functions
// --------------------------------------------------------

import { applyMiddleware } from 'redux';
import { connect as _connect } from 'react-redux';

export function composeReducers(reducers) {
  return (_state, action) => {
    let state = _state;
    for (let reducer of reducers) {
      state = reducer(state, action);
    }
    return state;
  };
}

export function combineReducers(reducers) {
  const keys = Object.keys(reducers);
  return (state, action) => {
    return state.withMutations(mutState => {
      for (let key of keys) {
        const reducer = reducers[key];
        const domainState = mutState.get(key);
        mutState.set(key, reducer(domainState, action));
      }
    });
  };
}

const DEFAULT_STATE_TO_PROPS = state => ({ state });
const DEFAULT_DISPATCH_TO_PROPS = dispatch => ({ dispatch });

/**
 * Wrap component to connect it to Redux store via props
 *
 * @param {function} mapStateToProps
 * @param {function} mapDispatchToProps
 * @param {any} Component
 */
export function connect(mapStateToProps = null, mapDispatchToProps = null, Component) {
  if (arguments.length === 1) {
    return connect(
      DEFAULT_STATE_TO_PROPS,
      DEFAULT_DISPATCH_TO_PROPS,
      arguments[0]);
  }
  if (arguments.length === 2) {
    return connect(
      arguments[0],
      DEFAULT_DISPATCH_TO_PROPS,
      arguments[1]);
  }
  return _connect(mapStateToProps, mapDispatchToProps)(Component);
}
