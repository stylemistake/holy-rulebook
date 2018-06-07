import Storage from './lib/Storage.js';

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
};

export function loadState() {
  return async (dispatch) => {
    const gameStates = await storage.get('gameStates') || [];
    dispatch({
      type: actionTypes.LOAD_STATE,
      gameStates,
    });
  };
};

export function saveState(state) {
  return async (dispatch) => {
    const gameStates = state.get('gameStates').toJS();
    await storage.set('gameStates', gameStates);
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
    text,
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
    id,
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
    id,
  };
}

export function removeCharacter(id) {
  return {
    type: actionTypes.REMOVE_CHARACTER,
    id,
  };
}

export function updateCharacterValue(id, path, value) {
  return {
    type: 'UPDATE_CHARACTER_VALUE',
    id, // character id
    path, // path to the value
    value, // updated value
  };
}
