'use strict';

import Entity from './Entity.js';
import Skill from './Skill.js';
import Section from './Section.js';

export default {
  query,
  queryAll,
  findSkills,
};

// Webpack context for YAML files
const requireYaml = require.context('../../rulebook', true, /\.yaml$/);

// Contains type -> constructor mappings
const entityTypeMap = new Map([
  ['skill', Skill],
  ['section', Section],
]);

// A very ugly and temporary Skill storage
const uglySkillList = requireYaml.keys()
  .map((path) => {
    const obj = requireYaml(path);
    return obj && obj[0];
  })
  // NOTE: Store only skill entities for now
  .filter((x) => x && x.type === 'skill')
  .map((x) => {
    const TargetEntity = entityTypeMap.get(x.type) || Entity;
    return new TargetEntity().fromData(x);
  });

/**
 * Query an entity.
 * Example uri: /skills/acrobatics
 *
 * @param  {string} uri
 * @return {any}
 */
export function query(uri) {
  const obj = requireYaml('.' + uri + '.yaml');
  if (!obj && !obj[0]) {
    return null;
  }
  const TargetEntity = entityTypeMap.get(obj[0].type) || Entity;
  return new TargetEntity().fromData(obj[0]);
}

/**
 * Query an array of entities.
 * Example uri: /skills/acrobatics
 *
 * @param  {string} uri
 * @return {any[]}
 */
export function queryAll(uri) {
  const obj = requireYaml('.' + uri + '.yaml');
  if (!obj) {
    return null;
  }
  return obj.map((x) => {
    const TargetEntity = entityTypeMap.get(x.type) || Entity;
    return new TargetEntity().fromData(x);
  });
}

/**
 * Get all skill entities
 *
 * @return {Skill}
 */
  export function findSkills() {
  // TODO: Implement a better storage
  // TODO: Implement a query mechanism
  return uglySkillList;
}
