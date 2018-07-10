import { loadState } from './persistenceActions.js';
import { Storage } from './persistenceStorage.js';
import { serializeState, deserializeState } from './serialize.js';

export function createPersistenceMiddleware() {
  const storage = new Storage();
  return store => persistenceMiddleware(store, storage);
}

const PERSIST_ACTIONS = [
  'GAME_STATE_SELECT',
  'CHARACTER_SELECT',
];

const PERSIST_PROPS = [
  'activeGameStateId',
  'activeCharacterId',
];

function persistenceMiddleware(store, storage) {
  let loaded = false;
  return next => async action => {
    // Load state once
    if (!loaded) {
      loaded = true;
      console.debug('persistence: loading state');
      const obj = await storage.get('state');
      console.debug('persistence: loaded object', obj);
      if (!obj) {
        console.debug('persistence: nothing to load');
        return;
      }
      const state = deserializeState(obj, PERSIST_PROPS);
      store.dispatch(loadState(state));
      return next(action);
    }
    // Save state
    if (PERSIST_ACTIONS.includes(action.type)) {
      next(action);
      const state = store.getState();
      const obj = serializeState(state, PERSIST_PROPS);
      if (!obj) {
        console.debug('persistence: nothing to save');
        return;
      }
      console.debug('persistence: saving state', obj);
      await storage.set('state', obj);
      console.debug('persistence: saved');
      return;
    }
    // Purge state
    if (action.type === 'PERSISTENCE_PURGE') {
      await storage.purge();
      window.location.reload();
      return;
    }
    return next(action);
  };
}

export function persistenceReducer(state, action) {
  const { type, payload } = action;

  if (type === 'PERSISTENCE_LOAD') {
    return state.merge(payload.state);
  }

  return state;
}
