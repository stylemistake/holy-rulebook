function updateGameState(state, gameStateId, updater) {
  return state.updateIn(['gameStates', gameStateId], updater);
}

export default function gameStateReducer(state, action) {
  const { type, payload, meta } = action;

  if (type === 'GAME_STATE_CREATE') {
    const { gameState } = payload;
    return state.setIn(['gameStates', gameState.get('id')],
      gameState.set('updatedAt', meta.updatedAt));
  }

  if (type === 'GAME_STATE_SELECT') {
    const { gameStateId } = payload;
    return state.set('activeGameStateId', gameStateId);
  }

  if (type === 'CHARACTER_CREATE') {
    const gameStateId = state.get('activeGameStateId');
    const { character } = payload;
    return updateGameState(state, gameStateId, gameState => {
      return gameState
        .updateIn(['characters'], (characters) => {
          return characters.add(character.get('id'));
        })
        .set('updatedAt', meta.updatedAt);
    });
  }

  if (type === 'CHARACTER_REMOVE') {
    const gameStateId = state.get('activeGameStateId');
    const { characterId } = payload;
    return updateGameState(state, gameStateId, gameState => {
      return gameState
        .updateIn(['characters'], (characters) => {
          return characters.delete(characterId);
        })
        .set('updatedAt', meta.updatedAt);
    });
  }

  return state;
}
