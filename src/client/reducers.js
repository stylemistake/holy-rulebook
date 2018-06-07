import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { actionTypes } from './actions.js';
import * as queries from './queries.js';

const INITIAL_STATE = fromJS({
  updatedAt: null,
  loaded: false,
  gameStates: [],
  activeGameStateId: null,
  activeCharacterId: null,
});

function withUpdate(state) {
  return state.merge({
    updatedAt: Date.now(),
  });
}

function globalReducer(_state = INITIAL_STATE, action) {
  let state = _state;

  switch (action.type) {

    case actionTypes.LOAD_STATE: {
      return state.merge({
        loaded: true,
        gameStates: action.gameStates,
      });
    }

    case actionTypes.SAVE_STATE: {
      return state;
    }

    case actionTypes.CREATE_GAME_STATE: {
      return withUpdate(state).update('gameStates', (x) => {
        const gameState = queries.makeGameState();
        if (!x) {
          return fromJS([gameState]);
        }
        return x.push(gameState);
      });
    }

    case actionTypes.SELECT_GAME_STATE: {
      return state.set('activeGameStateId', action.id);
    }

    case actionTypes.CREATE_CHARACTER: {
      const gameStateIndex = queries.getActiveGameStateIndex(state);
      const path = ['gameStates', gameStateIndex, 'characters'];
      return withUpdate(state).updateIn(path, (x) => {
        return x.push(queries.makeCharacter());
      });
    }

    case actionTypes.SELECT_CHARACTER: {
      return state.set('activeCharacterId', action.id);
    }

    case actionTypes.REMOVE_CHARACTER: {
      const characterIndex = queries.getCharacterIndex(state, action.id);
      if (state.get('activeCharacterId') === action.id) {
        state = state.delete('activeCharacterId', null);
      }
      const gameStateIndex = queries.getActiveGameStateIndex(state);
      const path = ['gameStates', gameStateIndex, 'characters', characterIndex];
      return withUpdate(state).deleteIn(path);
    }

    case actionTypes.UPDATE_CHARACTER_VALUE: {
      const gameStateIndex = queries.getActiveGameStateIndex(state);
      const characterIndex = queries.getCharacterIndex(state, action.id);
      const path = ['gameStates', gameStateIndex, 'characters', characterIndex]
        .concat(action.path);
      return withUpdate(state).setIn(path, action.value);
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
