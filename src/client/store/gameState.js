function updateGameState(state, gameStateId, updater) {
  return state.updateIn(['gameStates', gameStateId], updater);
}

export function gameStateReducer(state, action) {
  const { type, payload, meta } = action;

  if (type === 'GAME_STATE_CREATE') {
    const { gameState } = payload;
    return state.setIn(['gameStates', gameState.get('id')],
      gameState.set('updatedAt', meta.updatedAt));
  }

  if (type === 'CHARACTER_CREATE') {
    const { character, gameStateId } = payload;
    return updateGameState(state, gameStateId, gameState => {
      return gameState
        .updateIn(['characters'], (characters) => {
          return characters.add(character.get('id'));
        })
        .set('updatedAt', meta.updatedAt);
    });
  }

  if (type === 'CHARACTER_REMOVE') {
    const { characterId } = payload;
    return state.update('gameStates', gameStates => {
      return gameStates.map(gameState => {
        if (!gameState.get('characters').has(characterId)) {
          return gameState;
        }
        return gameState
          .updateIn(['characters'], (characters) => {
            return characters.delete(characterId);
          })
          .set('updatedAt', meta.updatedAt);
      });
    });
  }

  return state;
}
