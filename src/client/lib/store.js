'use strict';

import Entity from './Entity.js';
import Skill from './Skill.js';
import Section from './Section.js';
import GameState from './GameState';

// Webpack context for YAML files
const requireYaml = require.context('../../rulebook', true, /\.yaml$/);

// Contains type -> constructor mappings
const ENTITY_TYPE_MAP = new Map([
  ['skill', Skill],
  ['section', Section],
]);

// A very ugly and temporary Skill storage
const SKILL_LIST_UGLY = requireYaml.keys()
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

/**
 * God class for managing all objects
 */
class Store {

  constructor() {
    this.gameState = new GameState();
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
    return SKILL_LIST_UGLY;
  }

  getGameState() {
    return this.gameState;
  }

}

const store = new Store();

export default store;
