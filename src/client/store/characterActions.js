import * as Character from './characterClass.js';

export function createCharacter(gameStateId) {
  const character = Character.make();
  return {
    type: 'CHARACTER_CREATE',
    payload: { character, gameStateId },
    meta: {
      updatedAt: Date.now(),
    },
  };
}

export function selectCharacter(characterId) {
  return {
    type: 'CHARACTER_SELECT',
    payload: { characterId },
    // meta: {
    //   updatedAt: Date.now(),
    // },
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

export function buyCharacteristic(characterId, charcId) {
  return {
    type: 'CHARACTER_CHARACTERISTIC_BUY',
    payload: { characterId, charcId },
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
