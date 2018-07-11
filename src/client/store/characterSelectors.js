import { List, Map } from 'immutable';
import {
  getRulebookCharacteristics,
  getRulebookCharacteristicXpCosts,
  getRulebookSpecSkills,
  getRulebookSkillXpCosts,
  getRulebookSkillTierBonus,
} from './rulebookSelectors.js';

//  Helper functions
// --------------------------------------------------------

function countMatchingAptitudes(character, aptitudes) {
  return character.get('aptitudes')
    .filter(aptitude => aptitude === 'General' || aptitudes.includes(aptitude))
    .count();
}

function getXpPurchasesOf(character, payload) {
  return character.get('xpLog')
    .filter(entry => entry.get('type') === 'spend')
    .filter(entry => Map(payload).isSubset(entry.get('payload')))
}

function countXPPurchasesOf(character, payload) {
  return getXpPurchasesOf(character, payload).count();
}


//  Selectors
// --------------------------------------------------------

export function getCharacters(state) {
  return state.get('characters').toList();
}

export function getCharacter(state, characterId) {
  return state.getIn(['characters', characterId]);
}

export function getCharacterGameState(state, characterId) {
  return state.get('gameStates').find(gameState => {
    return gameState.get('characters').has(characterId);
  });
}

export function getCharacterGameStateId(state, characterId) {
  const gameState = getCharacterGameState(state, characterId);
  return gameState && gameState.get('id');
}

export function getCharacterCharacteristics(state, characterId) {
  const character = getCharacter(state, characterId);
  if (!character) {
    return List();
  }
  return getRulebookCharacteristics(state)
    .map(charc => {
      const charcId = charc.get('id');
      const tier = countXPPurchasesOf(character, {
        type: 'charc',
        id: charcId,
      });
      const startingValue = character.getIn(['charcs', charcId]) || 0;
      const value = startingValue + tier * 5;
      const matchingApts = countMatchingAptitudes(character, charc.get('aptitudes'));
      const cost = getRulebookCharacteristicXpCosts(state, matchingApts, tier);
      return charc.merge({
        tier,
        value,
        matchingApts,
        cost,
      });
    });
}

export function getCharacterSkills(state, characterId) {
  const character = getCharacter(state, characterId);
  if (!character) {
    return List();
  }
  return getRulebookSpecSkills(state)
    .map(skill => {
      const skillName = skill.get('name');
      const skillSpec = skill.get('specialization');
      const tier = countXPPurchasesOf(character, {
        type: 'skill',
        name: skillName,
        spec: skillSpec,
      });
      const bonus = getRulebookSkillTierBonus(state, tier);
      const matchingApts = countMatchingAptitudes(character, skill.get('aptitudes'));
      const cost = getRulebookSkillXpCosts(state, matchingApts, tier);
      return skill.merge({
        tier,
        bonus,
        matchingApts,
        cost,
      });
    });
}

export function getCharacterAvailableXp(state, characterId) {
  const character = getCharacter(state, characterId);
  if (!character) {
    return null;
  }
  return character.get('xpLog')
    .map(x => {
      const amount = x.get('amount');
      if (x.get('type') === 'grant') {
        return amount;
      }
      if (x.get('type') === 'spend') {
        return -amount;
      }
      return 0;
    })
    .reduce((a, b) => a + b);
}

export function getCharacterSpentXpLogEntries(state, characterId) {
  const character = getCharacter(state, characterId);
  if (!character) {
    return List();
  }
  return character.get('xpLog')
    .filter(x => x.get('type') === 'spend');
}

export function getCharacterGrantedXpLogEntries(state, characterId) {
  const character = getCharacter(state, characterId);
  if (!character) {
    return List();
  }
  return character.get('xpLog')
    .filter(x => x.get('type') === 'grant');
}
