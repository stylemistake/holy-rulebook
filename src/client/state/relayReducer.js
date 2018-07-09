import { fromJS } from 'immutable';

export default function relayReducer(state, action) {
  const { type, payload } = action;

  if (type === 'RELAY_ACCEPT_GAME_STATE') {
    const gameState = payload.get('gameState');
    return state.setIn(['gameStates', gameState.get('id')], gameState);
  }

  if (type === 'RELAY_ACCEPT_CHARACTER') {
    const character = payload.get('character');
    return state.setIn(['characters', character.get('id')], character);
  }

  return state;
}
