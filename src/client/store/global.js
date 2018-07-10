import { Map, OrderedMap } from 'immutable';

const INITIAL_STATE = OrderedMap({
  gameStates: OrderedMap(),
  characters: OrderedMap(),
  activeGameStateId: null,
  activeCharacterId: null,
});

export function globalReducer(state = INITIAL_STATE, action) {
  const { type, payload, meta } = action;

  if (type === 'OPEN_DETAILS_PANE') {
    return state.set('detailsPane', Map(payload));
  }

  if (type === 'CLOSE_DETAILS_PANE') {
    return state.delete('detailsPane');
  }

  return state;
}

// Updates timestamp to trigger state saving
export function updatedAtReducer(state, action) {
  const { meta } = action;
  if (meta && meta.updatedAt) {
    return state.set('updatedAt', meta.updatedAt);
  }
  return state;
}
