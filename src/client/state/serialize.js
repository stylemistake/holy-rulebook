import { isKeyed, fromJS } from 'immutable';
import { testKeyPath, transformCollection } from '../utils.js';

function pick(map, keys) {
  return map.filter((x, i) => keys.includes(i));
}

const DEFAULT_PROPS = [
  'gameStates',
  'characters',
  'activeGameStateId',
  'activeCharacterId',
  'updatedAt',
];

export function serializeState(state, props = DEFAULT_PROPS) {
  const filteredState = pick(state, props);
  return transformCollection(filteredState, (value, path) => {
    // Single objects
    if (testKeyPath(path, '/gameState/characters')) {
      return value.toArray();
    }
    // Full state objects
    if (testKeyPath(path, '/gameStates')) {
      return value.toIndexedSeq().toArray();
    }
    if (testKeyPath(path, '/gameStates/*/characters')) {
      return value.toArray();
    }
    if (testKeyPath(path, '/characters')) {
      return value.toIndexedSeq().toArray();
    }
    return isKeyed(value)
      ? value.toObject()
      : value.toArray();
  });
}

export function deserializeState(obj) {
  return transformCollection(obj, (value, path) => {
    // Single objects
    if (testKeyPath(path, '/gameState/characters')) {
      return value.toSet();
    }
    // Full state objects
    if (testKeyPath(path, '/gameStates')) {
      return value.toOrderedMap()
        .mapKeys((i, value) => value.get('id'));
    }
    if (testKeyPath(path, '/gameStates/*/characters')) {
      return value.toSet();
    }
    if (testKeyPath(path, '/characters')) {
      return value.toOrderedMap()
        .mapKeys((i, value) => value.get('id'));
    }
    return isKeyed(value)
      ? value.toMap()
      : value.toList();
  });
}
