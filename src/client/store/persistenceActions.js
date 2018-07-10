export function loadState(state) {
  return {
    type: 'PERSISTENCE_LOAD',
    payload: { state },
  };
};

export function saveState(state) {
  return {
    type: 'PERSISTENCE_SAVE',
  };
}

export function purgeState() {
  return {
    type: 'PERSISTENCE_PURGE',
  };
}
