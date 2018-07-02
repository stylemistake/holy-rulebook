import { combineReducers } from 'redux-immutable';
import { fromJS, OrderedMap, Record } from 'immutable';
import { actionTypes } from './actions.js';
import * as selectors from './selectors.js';
import GameState from './structs/GameState.js';

const INITIAL_STATE = OrderedMap({
  updatedAt: null,
  loaded: false,
  gameStates: OrderedMap(),
  activeGameStateId: null,
  activeCharacterId: null,
});

function markStateAsUpdated(state) {
  return state.merge({
    updatedAt: Date.now(),
  });
}

function globalReducer(_state = INITIAL_STATE, action) {
  const { payload } = action;
  let state = _state;

  switch (action.type) {

    case actionTypes.LOAD_STATE: {
      return state
        .set('loaded', true)
        .merge(payload.state);
    }

    case actionTypes.SAVE_STATE: {
      return state;
    }

    case actionTypes.CREATE_GAME_STATE: {
      const gameState = GameState.make();
      return markStateAsUpdated(state)
        .setIn(['gameStates', gameState.id], gameState);
    }

    case actionTypes.SELECT_GAME_STATE: {
      return state.set('activeGameStateId', payload.id);
    }

    case actionTypes.CREATE_CHARACTER: {
      const gameStateId = state.get('activeGameStateId');
      return markStateAsUpdated(state)
        .updateIn(['gameStates', gameStateId], (gameState) => {
          return gameState.createCharacter();
        });
    }

    case actionTypes.SELECT_CHARACTER: {
      return state.set('activeCharacterId', payload.id);
    }

    case actionTypes.REMOVE_CHARACTER: {
      const gameStateId = state.get('activeGameStateId');
      return markStateAsUpdated(state)
        .updateIn(['gameStates', gameStateId], (gameState) => {
          return gameState.removeCharacter(payload.id);
        });
    }

    case actionTypes.UPDATE_CHARACTER_VALUE: {
      const gameStateId = state.get('activeGameStateId');
      return markStateAsUpdated(state)
        .updateIn(['gameStates', gameStateId], (gameState) => {
          return gameState.updateCharacter(payload.id, (character) => {
            return character.setIn(payload.path, payload.value);
          });
        });
    }

    case actionTypes.OPEN_DETAILS_PANE: {
      return state.set('detailsPane', fromJS({
        route: payload.route,
        data: payload.data,
      }));
    }

    case actionTypes.CLOSE_DETAILS_PANE: {
      return state.delete('detailsPane');
    }

    default: {
      console.log('Unhandled action', action);
      return state;
    }

  }
}

export function createReducer() {
  return globalReducer;
  // return combineReducers({
  //   test: testReducer,
  // });
}
