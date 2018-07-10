export function createRulebookMiddleware() {
  return rulebookMiddleware;
}

function rulebookMiddleware(store) {
  let loaded = false;
  return next => action => {
    // Load rulebook once
    if (!loaded) {
      loaded = true;
      store.dispatch(loadRulebook());
    }
    return next(action);
  };
}

function loadRulebook() {
  return async dispatch => {
    const res = await fetch('/rulebook');
    const rulebook = await res.json();
    dispatch({
      type: 'RULEBOOK_LOAD',
      payload: { rulebook },
    });
  };
}

export function rulebookReducer(state, action) {
  const { type, payload, meta } = action;

  if (type === 'RULEBOOK_LOAD') {
    return state.merge({
      rulebook: payload.rulebook,
    });
  }

  return state;
}
