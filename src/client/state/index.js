import * as Character from './character.js';
import * as characterActions from './characterActions.js';
import * as GameState from './gameState.js';
import * as gameStateActions from './gameStateActions.js';
import * as globalActions from './globalActions.js';
import * as globalSelectors from './globalSelectors.js';

// Exporting the global reducer
export { default as globalReducer } from './globalReducer.js';

// Exporting selectors together
export const selectors = {
  ...globalSelectors,
};

// Exporting actions together
export const actions = {
  ...globalActions,
  ...characterActions, // TODO: This should be eventually removed
  ...gameStateActions, // TODO: This should be eventually removed
};

// Exporting everything separately
export { Character }
export { characterActions }
export { GameState }
export { gameStateActions }
export { globalActions }
export { globalSelectors }
