import Storage from './Storage.js';
import { fromJS, isKeyed } from 'immutable';
import Character from './structs/Character.js';
import GameState from './structs/GameState.js';
import { testKeyPath, transformCollection } from './utils.js';

const storage = new Storage();

export const actionTypes = {
  LOAD_STATE: 'LOAD_STATE',
  SAVE_STATE: 'SAVE_STATE',
  CREATE_GAME_STATE: 'CREATE_GAME_STATE',
  SELECT_GAME_STATE: 'SELECT_GAME_STATE',
  CREATE_CHARACTER: 'CREATE_CHARACTER',
  SELECT_CHARACTER: 'SELECT_CHARACTER',
  REMOVE_CHARACTER: 'REMOVE_CHARACTER',
  UPDATE_CHARACTER_VALUE: 'UPDATE_CHARACTER_VALUE',
  SELECT_CHARACTERISTIC: 'SELECT_CHARACTERISTIC',
  OPEN_DETAILS_PANE: 'OPEN_DETAILS_PANE',
  CLOSE_DETAILS_PANE: 'CLOSE_DETAILS_PANE',
  XP_LOG_APPEND: 'XP_LOG_APPEND',
  XP_LOG_REMOVE: 'XP_LOG_REMOVE',
};

function serializeState(state) {
  const filteredState = state.filter((x, i) => {
    if (i === 'gameStates') {
      return true;
    }
    return false;
  });
  return transformCollection(filteredState, (value, path) => {
    if (testKeyPath(path, '/gameStates')) {
      return value.toIndexedSeq().toArray();
    }
    if (testKeyPath(path, '/gameStates/*/characters')) {
      return value.toIndexedSeq().toArray();
    }
    return isKeyed(value)
      ? value.toObject()
      : value.toArray();
  });
}

function deserializeState(obj) {
  return transformCollection(obj, (value, path) => {
    if (testKeyPath(path, '/gameStates')) {
      return value.toOrderedMap()
        .mapKeys((i, value) => value.get('id'));
    }
    if (testKeyPath(path, '/gameStates/*')) {
      return new GameState(value.toMap());
    }
    if (testKeyPath(path, '/gameStates/*/characters')) {
      return value.toOrderedMap()
        .mapKeys((i, value) => value.get('id'));
    }
    if (testKeyPath(path, '/gameStates/*/characters/*')) {
      return new Character(value.toMap());
    }
    return isKeyed(value)
      ? value.toMap()
      : value.toList();
  });
}

export function loadState() {
  return async (dispatch) => {
    console.log('Loading state...');
    const obj = await storage.get('state');
    console.log('Serialized state:', obj);
    if (!obj) {
      return;
    }
    const state = deserializeState(obj);
    console.log('Loaded!');
    dispatch({
      type: actionTypes.LOAD_STATE,
      payload: { state },
    });
  };
};

export function saveState(state) {
  return async (dispatch) => {
    console.log('Saving state...');
    const obj = serializeState(state);
    console.log('Serialized state:', obj);
    if (!obj) {
      return;
    }
    await storage.set('state', obj);
    console.log('Saved!');
    dispatch({
      type: actionTypes.SAVE_STATE,
    });
  };
}

export function purgeState() {
  return async (dispatch) => {
    storage.purge();
    window.location.reload();
  };
}

// TODO: Implement search
export function searchQuery(text) {
  return {
    type: 'SEARCH_QUERY',
    payload: { text },
  };
}

export function createGameState() {
  return {
    type: actionTypes.CREATE_GAME_STATE,
  };
}

export function selectGameState(id) {
  return {
    type: actionTypes.SELECT_GAME_STATE,
    payload: { id },
  };
}

export function createCharacter() {
  return {
    type: actionTypes.CREATE_CHARACTER,
  };
}

export function selectCharacter(id) {
  return {
    type: actionTypes.SELECT_CHARACTER,
    payload: { id },
  };
}

export function removeCharacter(id) {
  return {
    type: actionTypes.REMOVE_CHARACTER,
    payload: { id },
  };
}

export function updateCharacterValue(id, path, value) {
  return {
    type: actionTypes.UPDATE_CHARACTER_VALUE,
    payload: {
      id, // character id
      path, // path to the value
      value, // updated value
    },
  };
}

export function openDetailsPane(route, params = {}) {
  return {
    type: actionTypes.OPEN_DETAILS_PANE,
    payload: {
      route,
      params,
    },
  };
}

export function closeDetailsPane() {
  return {
    type: actionTypes.CLOSE_DETAILS_PANE,
  };
}
