export default function gameStateReducer(state, action) {
  const { type, payload } = action;

  if (type === 'GAME_STATE_CREATE') {
    const { gameState } = payload;
    return state.setIn(['gameStates', gameState.get('id')], gameState);
  }

  if (type === 'GAME_STATE_SELECT') {
    const { gameStateId } = payload;
    return state.set('activeGameStateId', gameStateId);
  }

  if (type === 'CHARACTER_CREATE') {
    const gameStateId = state.get('activeGameStateId');
    const { character } = payload;
    return state.updateIn([
      'gameStates', gameStateId, 'characters',
    ], (characters) => {
      return characters.add(character.get('id'));
    });
  }

  if (type === 'CHARACTER_REMOVE') {
    const gameStateId = state.get('activeGameStateId');
    const { characterId } = payload;
    return state.deleteIn([
      'gameStates', gameStateId,
      'characters', characterId,
    ]);
  }

  return state;
}
