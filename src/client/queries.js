import { List, fromJS } from 'immutable';
import { uuid } from './lib/utils.js';

// // Query for rulebook data
// const acrobatics = store.query('/skills/acrobatics');
// const sections = store.queryAll('/sections/skills');
// const skills = store.findSkills();
// const toc = store.query('/toc');

export function makeGameState() {
  const id = uuid();
  return fromJS({
    id,
    name: `Gamestate [${id.substr(0, 8) + '...'}]`,
    characters: [],
  });
}

export function getGameStates(state) {
  return state.get('gameStates') || List();
}

export function getGameState(state, id) {
  return getGameStates(state)
    .find((x) => x.get('id') === id);
}

export function getActiveGameState(state) {
  return getGameState(state, state.get('activeGameStateId'));
}

export function getActiveGameStateIndex(state) {
  const gameStateId = state.get('activeGameStateId');
  return getGameStates(state)
    .findIndex((x) => x.get('id') === gameStateId);
}

export function getCharacters(state, gameStateId = null) {
  const gameState = gameStateId
    ? getGameState(state, gameStateId)
    : getActiveGameState(state);
  if (!gameState) {
    return List();
  }
  return gameState.get('characters');
}

export function getCharacter(state, id, gameStateId = null) {
  return getCharacters(state, gameStateId)
    .find((x) => x.get('id') === id);
}

export function getCharacterIndex(state, id, gameStateId = null) {
  return getCharacters(state, gameStateId)
    .findIndex((x) => x.get('id') === id);
}

export function getActiveCharacter(state) {
  const id = state.get('activeCharacterId');
  return getCharacters(state)
    .find((x) => x.get('id') === id);
}

export function getActiveCharacterIndex(state) {
  const id = state.get('activeCharacterId');
  return getCharacters(state)
    .findIndex((x) => x.get('id') === id);
}

export function makeCharacter() {
  return fromJS({
    id: uuid(),
    name: 'New character',
    charcs: {
      ws: 28,
      bs: 38,
      s: 33,
      t: 34,
      ag: 34,
      int: 45,
      per: 33,
      wp: 39,
      fel: 42,
      status: 44,
      inf: 44,
      wounds: 11,
      fp: 4,
    },
    state: {
      damage: 0,
      fatigue: 0,
      corruption: 0,
      stress: 0,
      fate: 4,
      experience: 2000,
    },
    skills: [
      {
        name: 'Awareness',
        tier: 1,
      },
      {
        name: 'Charm',
        tier: 3,
      },
      {
        name: 'Medicae',
        tier: 5,
      },
      {
        name: 'Dodge',
        tier: 2,
      },
    ],
    talents: [
      {
        name: 'Weapon Training [Las]',
      },
    ],
  });
}

const CHARCS_META = fromJS([
  { id: 'ws',     name: 'Weapon skill' },
  { id: 'bs',     name: 'Ballistic skill' },
  { id: 's',      name: 'Strength' },
  { id: 't',      name: 'Toughness' },
  { id: 'ag',     name: 'Agility' },
  { id: 'int',    name: 'Intelligence' },
  { id: 'per',    name: 'Perception' },
  { id: 'wp',     name: 'Willpower' },
  { id: 'fel',    name: 'Fellowship' },
  { id: 'status', name: 'Status' },
  { id: 'inf',    name: 'Influence' },
  { id: 'wounds', name: 'Wounds' },
  { id: 'fp',     name: 'Fate points' },
]);

export function getCharacterCharcs(character) {
  if (!character) {
    return List();
  }
  const charcs = character.get('charcs');
  return CHARCS_META.map((x) => {
    const value = charcs.get(x.get('id'));
    return x.merge({ value });
  });
}
