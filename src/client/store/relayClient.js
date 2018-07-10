import { EventEmitter } from '../utils.js';

function getWsBaseUrl(path) {
  const origin = new URL(window.location.href).origin;
  return origin.replace('http', 'ws');
}

export function createRelayClient() {
  return new Relay();
}

export class Relay {

  constructor() {
    this.emitter = new EventEmitter();
    this.url = getWsBaseUrl() + '/relay';
    this.connecting = false;
  }

  connect() {
    if (!this.connecting && this.websocket) {
      return this;
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
      const msg = JSON.parse(e.data);
      console.debug('relay: message', msg);
      this.emitter.emit('message', msg);
    };
    this.websocket.onerror = e => {
      console.debug('relay: error', e);
    };
    return this;
  }

  disconnect() {
    if (!this.websocket) {
      return this;
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.websocket.close(1000);
    this.websocket = undefined;
    return this;
  }

  onConnected(fn) {
    this.emitter.on('connected', fn);
    return this;
  }

  onConnecting(fn) {
    this.emitter.on('connecting', fn);
    return this;
  }

  onDisconnected(fn) {
    this.emitter.on('disconnected', fn);
    return this;
  }

  onMessage(fn) {
    this.emitter.on('message', fn);
    return this;
  }

  clearListeners() {
    this.emitter.clear();
    return this;
  }

  sendMessage(type, payload) {
    const time = Date.now();
    this.websocket.send(JSON.stringify({ type, payload, time }));
    return this;
  }

}
