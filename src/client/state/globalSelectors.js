import { List } from 'immutable';

export function getGameStates(state) {
  return state.get('gameStates').toList();
}

export function getActiveGameState(state) {
  const gameStateId = state.get('activeGameStateId');
  return state.getIn(['gameStates', gameStateId]);
}

export function getActiveGameStateCharacters(state) {
  const gameStateId = state.get('activeGameStateId');
  const characterIds = state.getIn([
    'gameStates', gameStateId, 'characters',
  ]);
  if (!characterIds) {
    return List();
  }
  return getCharacters(state)
    .filter((character) => characterIds.has(character.get('id')));
}

export function getCharacters(state) {
  return state.get('characters').toList();
}

export function getCharacter(state, characterId) {
  return state.getIn(['characters', characterId]);
}

export function getActiveCharacter(state) {
  return getCharacter(state, state.get('activeCharacterId'));
}
