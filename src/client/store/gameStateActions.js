import { Map, Set } from 'immutable';
import { createUuid } from '../uuid.js';

export function createGameState() {
  const uuid = createUuid();
  const gameState = Map({
    id: uuid,
    name: `Gamestate [${uuid.substr(0, 8)}...]`,
    characters: Set(),
  });
  return {
    type: 'GAME_STATE_CREATE',
    payload: { gameState },
    meta: {
      updatedAt: Date.now(),
    },
  };
}
