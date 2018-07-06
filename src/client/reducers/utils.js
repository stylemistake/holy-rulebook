export function unhandledAction(state, action) {
  console.log('Unhandled action', action);
  return state;
}
