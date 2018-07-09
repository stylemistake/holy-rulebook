import { semaphore } from 'redux-semaphore';
import { EventEmitter, sleep } from '../utils.js';
import { serializeState, deserializeState } from './serialize.js';

function getWsBaseUrl(path) {
  const origin = new URL(window.location.href).origin;
  return origin.replace('http', 'ws');
}

class RelayClient {

  constructor() {
    this.emitter = new EventEmitter();
    this.url = getWsBaseUrl() + '/relay';
    this.connecting = false;
  }

  connect() {
    if (!this.connecting && this.websocket) {
      return;
    }
    this.connecting = true;
    this.emitter.emit('connecting');
    this.websocket = new WebSocket(this.url, ['v1']);
    this.websocket.onopen = e => {
      this.connecting = false;
      this.emitter.emit('connected');
    };
    this.websocket.onclose = e => {
      if (e.code === 1000) {
        this.emitter.emit('disconnected');
        return;
      }
      if (!this.connecting) {
        this.emitter.emit('connecting');
        this.connecting = true;
      }
      this.timeout = setTimeout(() => this.connect(), 10000);
    };
    this.websocket.onmessage = e => {
      console.log('Relay message', e.data);
      const msg = JSON.parse(e.data);
      this.emitter.emit('message', msg);
    };
    this.websocket.onerror = e => {
      console.log('Relay error', e);
    };
  }

  disconnect() {
    if (!this.websocket) {
      return;
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.websocket.close(1000);
    this.websocket = undefined;
  }

  onConnected(fn) {
    this.emitter.on('connected', fn);
  }

  onConnecting(fn) {
    this.emitter.on('connecting', fn);
  }

  onDisconnected(fn) {
    this.emitter.on('disconnected', fn);
  }

  onMessage(fn) {
    this.emitter.on('message', fn);
  }

  clearListeners() {
    this.emitter.clear();
  }

  sendMsg(type, payload) {
    const time = Date.now();
    this.websocket.send(JSON.stringify({ type, payload, time }));
  }

}

const relay = new RelayClient();

export function connectToRelay() {
  return async (dispatch, getState) => {
    relay.clearListeners();
    relay.connect();
    // Setup event handlers
    relay.onConnecting(() => {
      dispatch({ type: 'RELAY_CONNECTING' });
    });
    relay.onConnected(() => {
      // Signal readiness
      relay.sendMsg('READY');
      dispatch({ type: 'RELAY_CONNECTED' });
    });
    relay.onDisconnected(() => {
      dispatch({ type: 'RELAY_DISCONNECTED' });
    });
    relay.onMessage(msg => {
      const { type, payload, time } = msg;
      if (type === 'GAME_STATE') {
        return dispatch({
          type: 'RELAY_ACCEPT_GAME_STATE',
          payload: deserializeState({ gameState: payload }),
        });
      }
      if (type === 'CHARACTER') {
        return dispatch({
          type: 'RELAY_ACCEPT_CHARACTER',
          payload: deserializeState({ character: payload }),
        });
      }
    });
    // Wait for connection
    await semaphore('RELAY_CONNECTED');
    // Start handling updates
    watchStateUpdates(dispatch, getState);
  };
}

async function watchStateUpdates(dispatch, getState) {
  while (true) {
    // Wait for update
    try {
      const action = await semaphore(action => {
        const { meta } = action;
        return meta && meta.updatedAt;
      }, action => {
        return action === 'RELAY_DISCONNECTED'
          || action === 'RELAY_CONNECTING';
      });
      // Skip if no payload
      if (!action.payload) {
        continue;
      }
      const state = getState();
      const updatedAt = state.get('updatedAt');
      const serialized = serializeState(state);
      // Check every gamestate
      serialized.gameStates.forEach(gameState => {
        // Use the fact that global updatedAt is the same as local updatedAt
        if (gameState.updatedAt === updatedAt) {
          relay.sendMsg('GAME_STATE', gameState);
        }
      });
      // Check every character
      serialized.characters.forEach(character => {
        // Use the fact that global updatedAt is the same as local updatedAt
        if (character.updatedAt === updatedAt) {
          relay.sendMsg('CHARACTER', character);
        }
      });
    }
    catch (err) {
      break;
    }
  }
}

export function disconnectFromRelay() {
  return async dispatch => {
    relay.disconnect();
  };
}
