export function getGameStates(state) {
  return state.get('gameStates').toList();
}

export function getGameState(state, gameStateId) {
  return state.getIn(['gameStates', gameStateId]);
}

export function getGameStateCharacters(state, gameStateId) {
  const gameState = getGameState(state, gameStateId);
  return state.get('characters')
    .filter((x, i) => gameState.get('characters').has(i))
    .toList();
}
