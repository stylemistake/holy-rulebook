import { Map, List } from 'immutable';
import { createUuid } from '../uuid.js';

export function createCharacter(gameStateId) {
  const character = Map({
    id: createUuid(),
    name: 'New character',
    state: Map({
      wounds: 0,
      fatigue: 0,
      corruption: 0,
      stress: 0,
      fate: 0,
      influence: 0,
      experience: 0,
    }),
    charcs: Map({
      ws: 20,
      bs: 20,
      s: 20,
      t: 20,
      ag: 20,
      int: 20,
      per: 20,
      wp: 20,
      fel: 20,
      status: 20,
      wounds: 10,
      fp: 0,
    }),
    xpLog: List(),
    xpFrozen: false,
    aptitudes: List(),
    items: List(),
  });
  return {
    type: 'CHARACTER_CREATE',
    payload: { character, gameStateId },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function removeCharacter(characterId) {
  return {
    type: 'CHARACTER_REMOVE',
    payload: { characterId },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function updateCharacterValue(characterId, path, value) {
  return {
    type: 'CHARACTER_VALUE_UPDATE',
    payload: { characterId, path, value },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function buyCharacteristic(characterId, charcId, cost) {
  return {
    type: 'CHARACTER_CHARACTERISTIC_BUY',
    payload: { characterId, charcId, cost },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function refundCharacteristic(characterId, charcId) {
  return {
    type: 'CHARACTER_CHARACTERISTIC_REFUND',
    payload: { characterId, charcId },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function buySkill(characterId, skillName, skillSpec, cost) {
  return {
    type: 'CHARACTER_SKILL_BUY',
    payload: { characterId, skillName, skillSpec, cost },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function refundSkill(characterId, skillName, skillSpec) {
  return {
    type: 'CHARACTER_SKILL_REFUND',
    payload: { characterId, skillName, skillSpec },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function buyTalent(characterId, talentName, talentSpec, cost) {
  return {
    type: 'CHARACTER_TALENT_BUY',
    payload: { characterId, talentName, talentSpec, cost },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function refundTalent(characterId, talentName, talentSpec) {
  return {
    type: 'CHARACTER_TALENT_REFUND',
    payload: { characterId, talentName, talentSpec },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function addAptitude(characterId, aptitudeName) {
  return {
    type: 'CHARACTER_APTITUDE_ADD',
    payload: { characterId, aptitudeName },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function removeAptitude(characterId, aptitudeName) {
  return {
    type: 'CHARACTER_APTITUDE_REMOVE',
    payload: { characterId, aptitudeName },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function grantXp(characterId, amount, desc) {
  return {
    type: 'CHARACTER_XP_GRANT',
    payload: { characterId, amount, desc },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function removeXpLogEntry(characterId, entry) {
  return {
    type: 'CHARACTER_XP_LOG_REMOVE',
    payload: { characterId, entry },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function toggleXpFreeze(characterId, value) {
  return {
    type: 'CHARACTER_XP_FREEZE_TOGGLE',
    payload: { characterId, value },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function addItem(characterId, item) {
  return {
    type: 'CHARACTER_ITEM_ADD',
    payload: { characterId, item },
    meta: {
      updatedAt: Date.now(),
    },
  };
}