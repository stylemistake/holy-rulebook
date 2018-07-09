import { createLogger } from './logger.mjs';
import { createUuid } from './uuid.mjs';

const logger = createLogger('relay');
const clients = new Set();
const gameStates = new Map();
const characters = new Map();

//  Client class
// --------------------------------------------------------

class Client {
  constructor(ws) {
    this.id = createUuid();
    this.ws = ws;
    this.tokens = new Set();
    this.ready = false;
    this.timeOffset = 0;
  }

  toString() {
    return `[${this.id.substr(0, 7)}]`;
  }

  sendMsg(type, payload) {
    this.ws.send(JSON.stringify({
      type,
      payload,
      time: Date.now() + this.timeOffset,
    }));
  }

  canManage(obj) {
    if (!obj.masterToken) {
      return false;
    }
    return this.tokens.has(obj.masterToken);
  }

  canAccess(obj) {
    if (this.canManage(obj)) {
      return true;
    }
    if (!obj.accessTokens) {
      return false;
    }
    for (let token in this.tokens) {
      if (obj.accessTokens.includes(token)) {
        return true;
      }
    }
    return false;
  }
}

//  State objects
// --------------------------------------------------------

class StateObject {
  constructor(obj) {
    Object.assign(this, obj);
  }

  toJS() {
    return Object.assign({}, )
  }
}

class GameState extends StateObject {}
class Character extends StateObject {}


//  Client list management
// --------------------------------------------------------

function createClient(ws) {
  const client = new Client(ws);
  clients.add(client);
  return client;
}

function deleteClient(client) {
  clients.delete(client);
}

function forEachClient(fn) {
  for (let client of clients) {
    if (client.ready) {
      fn(client);
    }
  }
}

//  Connection handling
// --------------------------------------------------------

export function acceptConnection(ws) {
  // Create new client object
  const client = createClient(ws);
  logger.log(`Client ${client} has connected`);
  logger.log(`Currently connected: ${clients.size}`);
  // Handle messages
  ws.on('message', (msgStr) => {
    const msg = JSON.parse(msgStr);
    const res = handleMessage(client, msg);
    if (res) {
      ws.send(JSON.stringify(res));
    }
  });
  // Handle disconnect
  ws.on('close', () => {
    // Delete client object
    logger.log(`Client ${client} has disconnected`);
    deleteClient(client);
    logger.log(`Currently connected: ${clients.size}`);
  });
}

function handleMessage(client, msg) {
  // logger.log('Incoming message:', msg);
  const { type, payload, time } = msg;
  if (type === 'TOKEN') {
    client.tokens.add(payload);
    logger.log(`Received token from client ${client}`);
    return;
  }
  if (type === 'READY') {
    logger.log(`Client ${client} is ready`);
    client.ready = true;
    client.timeOffset = Date.now() - time;
    logger.log(`Time offset: ${client.timeOffset}ms`);
    for (let gameState of gameStates.values()) {
      logger.log(`Pushing GameState to client ${client}`);
      client.sendMsg('GAME_STATE', gameState);
    }
    for (let character of characters.values()) {
      logger.log(`Pushing Character to client ${client}`);
      client.sendMsg('CHARACTER', character);
    }
    return;
  }
  if (type === 'GAME_STATE') {
    logger.log(`Receiving GameState from client ${client}`,
      `(offset: ${Date.now() - time}ms)`);
    let gameState = gameStates.get(payload.id);
    if (gameState) {
      // if (!client.canManage(gameState)) {
      //   return; // DISCARD
      // }
      const diff = gameState.updatedAt - payload.updatedAt;
      if (diff > 0) {
        logger.log(`Discarding (older by ${diff}ms)`);
        return; // DISCARD
      }
      Object.assign(gameState, payload);
    }
    else {
      // Create new GameState
      gameState = new GameState(payload);
    }
    // Update our GameState collection
    gameStates.set(gameState.id, gameState);
    // Trigger update
    forEachClient(_client => {
      if (_client === client) {
        return;
      }
      // if (!client.canAccess(gameState)) {
      //   return;
      // }
      logger.log(`Pushing GameState to client ${_client}`);
      _client.sendMsg('GAME_STATE', gameState);
    });
    return;
  }
  if (type === 'CHARACTER') {
    logger.log(`Receiving Character from client ${client}`,
      `(offset: ${Date.now() - time}ms)`);
    let character = characters.get(payload.id);
    if (character) {
      // if (!client.canManage(character)) {
      //   return; // DISCARD
      // }
      const diff = character.updatedAt - payload.updatedAt;
      if (diff > 0) {
        logger.log(`Discarding (older by ${diff}ms)`);
        return; // DISCARD
      }
      Object.assign(character, payload);
    }
    else {
      // Create new Character
      character = new Character(payload);
    }
    // Update our Character collection
    characters.set(character.id, character);
    // Trigger update
    forEachClient(_client => {
      if (_client === client) {
        return;
      }
      // if (!client.canAccess(character)) {
      //   return;
      // }
      logger.log(`Pushing Character to client ${_client}`);
      _client.sendMsg('CHARACTER', character);
    });
    return;
  }
  logger.log('Unhandled message', msg);
}
