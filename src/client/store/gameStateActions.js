import * as GameState from './gameStateClass.js';

export function createGameState() {
  const gameState = GameState.make();
  return {
    type: 'GAME_STATE_CREATE',
    payload: { gameState },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function selectGameState(gameStateId) {
  return {
    type: 'GAME_STATE_SELECT',
    payload: { gameStateId },
    // meta: {
    //   updatedAt: Date.now(),
    // },
  };
}
