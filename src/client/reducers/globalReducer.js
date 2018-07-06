import { fromJS, Map, OrderedMap, Record } from 'immutable';
import { actionTypes } from '../actions.js';
import GameState from '../structs/GameState.js';
import characterReducer from './characterReducer.js';
import { unhandledAction } from './utils.js';

const INITIAL_STATE = OrderedMap({
  updatedAt: null,
  loaded: false,
  gameStates: OrderedMap(),
  activeGameStateId: null,
  activeCharacterId: null,
});

export function markStateAsUpdated(state) {
  return state.merge({
    updatedAt: Date.now(),
  });
}

export default function globalReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;

  if (type === actionTypes.LOAD_STATE) {
    return state
      .set('loaded', true)
      .merge(payload.state);
  }

  if (type === actionTypes.SAVE_STATE) {
    return state;
  }

  if (type === actionTypes.CREATE_GAME_STATE) {
    const gameState = GameState.make();
    return markStateAsUpdated(state)
      .setIn(['gameStates', gameState.id], gameState);
  }

  if (type === actionTypes.SELECT_GAME_STATE) {
    return state.set('activeGameStateId', payload.id);
  }

  if (type === actionTypes.CREATE_CHARACTER) {
    const gameStateId = state.get('activeGameStateId');
    return markStateAsUpdated(state)
      .updateIn(['gameStates', gameStateId], (gameState) => {
        return gameState.createCharacter();
      });
  }

  if (type === actionTypes.SELECT_CHARACTER) {
    return state.set('activeCharacterId', payload.id);
  }

  if (type === actionTypes.REMOVE_CHARACTER) {
    const gameStateId = state.get('activeGameStateId');
    return markStateAsUpdated(state)
      .updateIn(['gameStates', gameStateId], (gameState) => {
        return gameState.removeCharacter(payload.id);
      });
  }

  if (type === actionTypes.UPDATE_CHARACTER_VALUE) {
    const gameStateId = state.get('activeGameStateId');
    return markStateAsUpdated(state)
      .updateIn(['gameStates', gameStateId], (gameState) => {
        return gameState.updateCharacter(payload.id, (character) => {
          return character.setIn(payload.path, payload.value);
        });
      });
  }

  if (type === actionTypes.OPEN_DETAILS_PANE) {
    return state.set('detailsPane', Map(payload));
  }

  if (type === actionTypes.CLOSE_DETAILS_PANE) {
    return state.delete('detailsPane');
  }

  if (characterReducer.acceptedTypes.includes(type)) {
    const gameStateId = state.get('activeGameStateId');
    const characterId = state.get('activeCharacterId');
    return markStateAsUpdated(state)
      .updateIn([
        'gameStates', gameStateId,
        'characters', characterId,
      ], (character) => {
        return characterReducer(character, action);
      });
  }

  return unhandledAction(state, action);
}
