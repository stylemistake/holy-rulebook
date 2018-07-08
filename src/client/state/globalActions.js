import Storage from '../Storage.js';
import { serializeState, deserializeState } from './serialize.js';

const storage = new Storage();

export function loadState() {
  return async dispatch => {
    console.log('Loading state...');
    const obj = await storage.get('state');
    console.log('Serialized state:', obj);
    if (!obj) {
      return;
    }
    const state = deserializeState(obj);
    console.log('Loaded!');
    dispatch({
      type: 'LOAD_STATE',
      payload: { state },
    });
  };
};

export function saveState(state) {
  return async dispatch => {
    console.log('Saving state...');
    const obj = serializeState(state);
    console.log('Serialized state:', obj);
    if (!obj) {
      return;
    }
    await storage.set('state', obj);
    console.log('Saved!');
    dispatch({
      type: 'SAVE_STATE',
    });
  };
}

export function purgeState() {
  return async dispatch => {
    storage.purge();
    window.location.reload();
  };
}

export function loadRulebook() {
  return async dispatch => {
    const res = await fetch('/rulebook');
    const rulebook = await res.json();
    dispatch({
      type: 'LOAD_RULEBOOK',
      payload: { rulebook },
    });
  };
}

// TODO: Implement search
export function searchQuery(text) {
  return {
    type: 'SEARCH_QUERY',
    payload: { text },
  };
}

export function openDetailsPane(route, params = {}) {
  return {
    type: 'OPEN_DETAILS_PANE',
    payload: { route, params },
  };
}

export function closeDetailsPane() {
  return {
    type: 'CLOSE_DETAILS_PANE',
  };
}
