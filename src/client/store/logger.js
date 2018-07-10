export function createLoggerMiddleware() {
  return loggerMiddleware;
}

function loggerMiddleware(store) {
  return next => action => {
    try {
      console.debug('store: action', action);
      next(action);
      const nextState = store.getState();
      console.debug('store: next state', nextState && nextState.toJS());
    }
    catch (err) {
      console.error('store: error', err);
      throw err;
    }
  }
}
