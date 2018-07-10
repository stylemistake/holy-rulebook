//  Actions
// --------------------------------------------------------

// Importing actions
import * as characterActions from './characterActions.js';
import * as gameStateActions from './gameStateActions.js';
import * as globalActions from './globalActions.js';
import * as persistenceActions from './persistenceActions.js';

// Exporting actions together
export const actions = {
  ...globalActions,
  ...characterActions,
  ...gameStateActions,
  ...persistenceActions,
};

// Exporting actions separately
export { characterActions }
export { gameStateActions }
export { globalActions }
export { persistenceActions }


//  Selectors
// --------------------------------------------------------

// Importing selectors
import * as globalSelectors from './globalSelectors.js';

// Exporting selectors together
export const selectors = {
  ...globalSelectors,
};

// Exporting selectors separately
export { globalSelectors }


//  Classes
// --------------------------------------------------------

// Importing classes
import * as Character from './characterClass.js';
import * as GameState from './gameStateClass.js';

// Exporting classes
export { Character }
export { GameState }


//  Reducers
// --------------------------------------------------------

// Importing reducers
import { globalReducer, updatedAtReducer } from './global.js';
import { characterReducer } from './character.js';
import { gameStateReducer } from './gameState.js';
import { persistenceReducer } from './persistence.js';
import { relayReducer } from './relay.js';
import { rulebookReducer } from './rulebook.js';

// Export all reducers as one reducer
export function createReducer() {
  return composeReducers([
    // This reducer
    globalReducer,
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
import { createRulebookMiddleware } from './rulebook.js';
import { createSemaphoreMiddleware } from './semaphore.js';

// Export middlewares as a store enhancer
export function createEnhancer() {
  const middlewares = [
    thunkMiddleware,
    createLoggerMiddleware(),
    createPersistenceMiddleware(),
    createRelayMiddleware(),
    createRulebookMiddleware(),
    createSemaphoreMiddleware(),
  ];
  return applyMiddleware(...middlewares);
}


//  Utility functions
// --------------------------------------------------------

import { applyMiddleware } from 'redux';

export function composeReducers(reducers) {
  return (_state, action) => {
    let state = _state;
    for (let reducer of reducers) {
      state = reducer(state, action);
    }
    return state;
  };
}
