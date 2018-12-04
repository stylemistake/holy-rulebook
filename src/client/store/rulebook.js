import { fromJS } from 'immutable';
import { unwind } from './rulebookSelectors.js';

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
    let rulebook = fromJS(payload.rulebook);
    const skills = unwind(rulebook.get('skills'), ['specializations'], (skill, spec) => {
      const name = skill.get('name');
      const specName = spec.get('name');
      return skill
        .set('displayName', `${name} [${specName}]`)
        .set('specialization', spec)
        .set('examples', spec.get('examples').size && spec.get('examples') || skill.get('examples'));
    }).map(skill => skill.delete('specializations'));
    rulebook = rulebook.set('skills', skills);
    return state.merge({
      rulebook
    });
  }

  return state;
}
