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
      const state = JSON.parse(e.data);
      this.emitter.emit('receiveState', state);
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

  onReceiveState(fn) {
    this.emitter.on('receiveState', fn);
  }

  clearListeners() {
    this.emitter.clear();
  }

  sendState(state) {
    this.websocket.send(JSON.stringify(state));
  }

}

const relay = new RelayClient();

export function connectToRelay() {
  return async (dispatch, getState) => {
    relay.clearListeners();
    relay.connect();
    relay.onConnecting(() => {
      dispatch({ type: 'RELAY_CONNECTING' });
    });
    relay.onConnected(() => {
      dispatch({ type: 'RELAY_CONNECTED' });
    });
    relay.onDisconnected(() => {
      dispatch({ type: 'RELAY_DISCONNECTED' });
    });
    relay.onReceiveState((receivedState) => {
      dispatch({ type: 'RELAY_STATE_RECEIVING' });
      const state = getState();
      if (!receivedState.updatedAt) {
        return;
      }
      if (!state.get('updatedAt')
          || receivedState.updatedAt > state.get('updatedAt')) {
        dispatch({
          type: 'LOAD_STATE',
          payload: {
            state: deserializeState(receivedState),
          },
        });
      }
    });
    startSendingState(dispatch, getState);
  };
}

async function startSendingState(dispatch, getState) {
  await semaphore('RELAY_CONNECTED');
  while (true) {
    const state = serializeState(getState());
    dispatch({ type: 'RELAY_STATE_SENDING' });
    relay.sendState(state);
    // Wait for SAVE_STATE
    try {
      await semaphore('SAVE_STATE', 'RELAY_DISCONNECTED');
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
