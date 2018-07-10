import { List } from 'immutable';

export function getCharacters(state) {
  return state.get('characters').toList();
}

export function getCharacter(state, characterId) {
  return state.getIn(['characters', characterId]);
}

export function getCharacterGameState(state, characterId) {
  return state.get('gameStates').find(gameState => {
    return gameState.get('characters').has(characterId);
  });
}

export function getCharacterGameStateId(state, characterId) {
  const gameState = getCharacterGameState(state, characterId);
  return gameState && gameState.get('id');
}

export function getCharacterSkills(state, characterId) {
  // TODO: Calculate skills based on XP purchases.
  // const character = getCharacter(state, characterId);
  // if (!character) {
  //   return null;
  // }
  // const result = self.get('xpLog')
  //   .filter(x => x.get('type') === 'spend')
  //   .filter(x => x.getIn(['payload', 'type']) === 'charc')
  //   .filter(x => x.getIn(['payload', 'id']) === id)
  //   .count();
  // console.log(result.toJS());
  return null;
}
