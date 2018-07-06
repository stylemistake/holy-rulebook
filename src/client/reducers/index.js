import globalReducer from './globalReducer.js';

export function createReducer() {
  return globalReducer;
}

export function unhandledAction(state, action, reducerName) {
  console.log(`Unhandled action in '${reducerName}':`, action);
  return state;
}
