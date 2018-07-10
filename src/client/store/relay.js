import { createRelayClient } from './relayClient.js';
import { serializeState, deserializeState } from './serialize.js';

export function createRelayMiddleware() {
  return store => relayMiddleware(store, createRelayClient());
}

function relayMiddleware(store, relay) {
  // Connect to relay server
  relay.connect()
  // Setup event handlers
  relay.onConnecting(() => {
    store.dispatch({ type: 'RELAY_CONNECTING' })
  });
  relay.onConnected(() => {
    // Signal readiness
    relay.sendMessage('READY');
    store.dispatch({ type: 'RELAY_CONNECTED' });
  });
  relay.onDisconnected(() => {
    store.dispatch({ type: 'RELAY_DISCONNECTED' });
  });
  relay.onMessage(msg => {
    const { type, payload, time } = msg;
    if (type === 'GAME_STATE') {
      return store.dispatch({
        type: 'RELAY_ACCEPT_GAME_STATE',
        payload: deserializeState({ gameState: payload }),
      });
    }
    if (type === 'CHARACTER') {
      return store.dispatch({
        type: 'RELAY_ACCEPT_CHARACTER',
        payload: deserializeState({ character: payload }),
      });
    }
  });
  // Handle state updates
  return next => action => {
    // Skip if no payload
    if (!action.payload) {
      return next(action);
    }
    const state = store.getState();
    const updatedAt = state.get('updatedAt');
    const serialized = serializeState(state);
    // Check every gamestate
    serialized.gameStates.forEach(gameState => {
      // Use the fact that global updatedAt is the same as local updatedAt
      if (gameState.updatedAt === updatedAt) {
        relay.sendMessage('GAME_STATE', gameState);
      }
    });
    // Check every character
    serialized.characters.forEach(character => {
      // Use the fact that global updatedAt is the same as local updatedAt
      if (character.updatedAt === updatedAt) {
        relay.sendMessage('CHARACTER', character);
      }
    });
    return next(action);
  };
}

export function relayReducer(state, action) {
  const { type, payload } = action;

  if (type === 'RELAY_ACCEPT_GAME_STATE') {
    const gameState = payload.get('gameState');
    return state.setIn(['gameStates', gameState.get('id')], gameState);
  }

  if (type === 'RELAY_ACCEPT_CHARACTER') {
    const character = payload.get('character');
    return state.setIn(['characters', character.get('id')], character);
  }

  return state;
}
