import * as Character from './character.js';
import * as characterActions from './characterActions.js';
import * as GameState from './gameState.js';
import * as gameStateActions from './gameStateActions.js';
import * as rootActions from './rootActions.js';
import * as rootSelectors from './rootSelectors.js';

// Exporting the root reducer
export { default as rootReducer } from './rootReducer.js';

// Exporting selectors together
export const selectors = {
  ...rootSelectors,
};

// Exporting actions together
export const actions = {
  ...rootActions,
  ...characterActions, // TODO: This should be eventually removed
  ...gameStateActions, // TODO: This should be eventually removed
};

// Exporting everything separately
export { Character }
export { characterActions }
export { GameState }
export { gameStateActions }
export { rootActions }
export { rootSelectors }
