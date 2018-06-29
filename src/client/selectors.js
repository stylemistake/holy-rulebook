import { OrderedMap, getIn } from 'immutable';
import { createUuid } from './utils.js';

// // Query for rulebook data
// const acrobatics = store.query('/skills/acrobatics');
// const sections = store.queryAll('/sections/skills');
// const skills = store.findSkills();
// const toc = store.query('/toc');

export function getGameStates(state) {
  const coll = state.get('gameStates') || OrderedMap();
  return coll.toList();
}

export function getActiveGameState(state) {
  const id = state.get('activeGameStateId');
  return state.getIn(['gameStates', id]);
}

export function getCharacters(state) {
  const gameStateId = state.get('activeGameStateId');
  const coll = state.getIn(['gameStates', gameStateId, 'characters'])
    || OrderedMap();
  return coll.toList();
}

export function getActiveCharacter(state) {
  const gameStateId = state.get('activeGameStateId');
  const characterId = state.get('activeCharacterId');
  return state.getIn(['gameStates', gameStateId, 'characters', characterId]);
}
