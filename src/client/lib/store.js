'use strict';

import Entity from './Entity.js';
import Skill from './Skill.js';
import Section from './Section.js';
import GameState from './GameState.js';
import EventEmitter from './EventEmitter.js';
import Storage from './Storage.js';
import { debounce } from './decorators.js';

// Webpack context for YAML files
const requireYaml = require.context('../../rulebook', true, /\.yaml$/);

// Contains type -> constructor mappings
const ENTITY_TYPE_MAP = new Map([
  ['skill', Skill],
  ['section', Section],
]);

/**
 * God class for managing all objects
 */
class Store {

  constructor() {
    this.storage = new Storage();
    this.emitter = new EventEmitter();
    this.gameStates = [];
    this.tokens = [];
    this.loadState();
  }

  async loadState() {
    console.log('Loading state...', this.gameStates);
    this.gameStates = (await this.storage.get('gameStates'))
      .map((x) => new GameState(x));
    this.emitter.emit('update');
  }

  @debounce(200)
  async saveState() {
    console.log('Saving state...', this.gameStates);
    this.storage.set('gameStates', this.gameStates);
  }

  /**
   * Query an entity.
   * Example uri: /skills/acrobatics
   *
   * @param  {string} uri
   * @return {any}
   */
  query(uri) {
    const obj = requireYaml('.' + uri + '.yaml');
    if (!obj && !obj[0]) {
      return null;
    }
    const TargetEntity = ENTITY_TYPE_MAP.get(obj[0].type) || Entity;
    return new TargetEntity().fromData(obj[0]);
  }

  /**
   * Query an array of entities.
   * Example uri: /skills/acrobatics
   *
   * @param  {string} uri
   * @return {any[]}
   */
  queryAll(uri) {
    const obj = requireYaml('.' + uri + '.yaml');
    if (!obj) {
      return null;
    }
    return obj.map((x) => {
      const TargetEntity = ENTITY_TYPE_MAP.get(x.type) || Entity;
      return new TargetEntity().fromData(x);
    });
  }

  findSkills() {
    // Ugly way to get all skills
    return requireYaml.keys()
      .map((path) => {
        const obj = requireYaml(path);
        return obj && obj[0];
      })
      // NOTE: Store only skill entities for now
      .filter((x) => x && x.type === 'skill')
      .map((x) => {
        const TargetEntity = ENTITY_TYPE_MAP.get(x.type) || Entity;
        return new TargetEntity().fromData(x);
      });
  }

  createGameState() {
    this.gameStates.push(new GameState());
    this.triggerUpdate();
  }

  addObserver(fn) {
    this.emitter.on('update', fn);
  }

  removeObserver(fn) {
    this.emitter.off('update', fn);
  }

  triggerUpdate() {
    this.emitter.emit('update');
    this.saveState();
  }

}

const store = new Store();

// This is indended only for debugging
global.store = store;

export default store;
