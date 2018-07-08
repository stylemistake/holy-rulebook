import { fromJS, Map, OrderedMap, Record } from 'immutable';
import characterReducer from './characterReducer.js';
import gameStateReducer from './gameStateReducer.js';

const INITIAL_STATE = OrderedMap({
  gameStates: OrderedMap(),
  characters: OrderedMap(),
  activeGameStateId: null,
  activeCharacterId: null,
  loaded: false,
  dirty: false,
});

function actionLogger(state, action) {
  console.log('Handling action', action);
  return state;
}

function rootReducer(state = INITIAL_STATE, action) {
  const { type, payload, meta } = action;

  if (type === 'LOAD_STATE') {
    return state
      .set('loaded', true)
      .merge(payload.state);
  }

  if (type === 'SAVE_STATE') {
    return state
      .set('dirty', false);
  }

  if (type === 'LOAD_RULEBOOK') {
    return state.merge({
      rulebook: payload.rulebook,
    });
  }

  if (type === 'OPEN_DETAILS_PANE') {
    return state.set('detailsPane', Map(payload));
  }

  if (type === 'CLOSE_DETAILS_PANE') {
    return state.delete('detailsPane');
  }

  return state;
}

function chainReducers(reducers) {
  return (_state, action) => {
    let state = _state;
    for (let reducer of reducers) {
      state = reducer(state, action);
    }
    return state;
  };
}

// Updates timestamp to trigger state saving
function updatedAtReducer(state, action) {
  const { meta } = action;
  if (meta && meta.updatedAt) {
    return state
      .set('dirty', true)
      .set('updatedAt', meta.updatedAt);
  }
  return state;
}

export default chainReducers([
  actionLogger,
  rootReducer,
  // Scoped reducers
  gameStateReducer,
  characterReducer,
  // Meta
  updatedAtReducer,
]);
