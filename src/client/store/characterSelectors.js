import { List, Map } from 'immutable';
import {
  getRulebookCharacteristics,
  getRulebookCharacteristicXpCosts,
  getRulebookSkillsWithSpecs,
  getRulebookSkillTierBonus,
  getRulebookSkillXpCosts,
  getRulebookTalents,
  getRulebookTalentsWithSpecs,
  getRulebookTalentXpCosts,
} from './rulebookSelectors.js';

//  Helper functions
// --------------------------------------------------------

function countMatchingAptitudes(character, aptitudes) {
  return character.get('aptitudes')
    .filter(aptitude => aptitude === 'General' || aptitudes.includes(aptitude))
    .count();
}

function getXpPurchasesOf(character, payload) {
  const filteredPayload = Map(payload).filter(x => !!x);
  return character.get('xpLog')
    .filter(entry => entry.get('type') === 'spend')
    .filter(entry => filteredPayload.isSubset(entry.get('payload')))
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

export function getCharacterAptitudes(state, characterId) {
  return state.getIn(['characters', characterId, 'aptitudes']) || List();
}

export function getCharacterCharacteristics(state, characterId) {
  const character = getCharacter(state, characterId);
  if (!character) {
    return List();
  }
  return getRulebookCharacteristics(state)
    .map(charc => {
      const id = charc.get('id');
      const purchaseCount = countXPPurchasesOf(character, { type: 'charc', id });
      const startingValue = character.getIn(['charcs', id]) || 0;
      const value = startingValue + purchaseCount * 5;
      const matchingApts = countMatchingAptitudes(character, charc.get('aptitudes'));
      const cost = getRulebookCharacteristicXpCosts(state, matchingApts, purchaseCount);
      return charc.merge({
        purchaseCount,
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
  const charcs = getCharacterCharacteristics(state, characterId);
  return getRulebookSkillsWithSpecs(state)
    .map(skill => getCharacterSkill(state, skill, character, charcs));
}

export function getCharacterSkill(state, skill, character, characterCharacteristics) {
  const name = skill.get('name');
  const spec = skill.get('specialization');
  const purchaseCount = countXPPurchasesOf(character, { type: 'skill', name, spec });
  const bonus = getRulebookSkillTierBonus(state, purchaseCount);
  const matchingApts = countMatchingAptitudes(character, skill.get('aptitudes'));
  const cost = getRulebookSkillXpCosts(state, matchingApts, purchaseCount);
  const charc = characterCharacteristics.find(charc => charc.get('name') === skill.get('characteristic'));
  const threshold = charc && (charc.get('value') + bonus);
  return skill.merge({
    purchaseCount,
    bonus,
    matchingApts,
    cost,
    charc,
    threshold,
  });
}

export function getCharacterTalents(state, characterId) {
  const character = getCharacter(state, characterId);
  if (!character) {
    return List();
  }
  return getRulebookTalents(state)
    .map(talent => getCharacterTalent(state, talent, character));
}

export function getCharacterTalent(state, talent, character) {
  const name = talent.get('name');
  const purchaseCount = countXPPurchasesOf(character, { type: 'talent', name });
  const tier = talent.get('tier');
  const matchingApts = countMatchingAptitudes(character, talent.get('aptitudes'));
  const cost = getRulebookTalentXpCosts(state, matchingApts, tier - 1);
  // Add purchase count to the talent name
  let displayName = talent.get('displayName');
  if (purchaseCount > 1) {
    displayName += ` (${purchaseCount})`;
  }
  return talent.merge({
    purchaseCount,
    matchingApts,
    cost,
    displayName,
  });
}

export function getCharacterXpLogEntries(state, characterId) {
  const character = getCharacter(state, characterId);
  if (!character) {
    return List();
  }
  return character.get('xpLog');
}

export function getCharacterSpentXpLogEntries(state, characterId) {
  return getCharacterXpLogEntries(state, characterId)
    .filter(x => x.get('type') === 'spend');
}

export function getCharacterGrantedXpLogEntries(state, characterId) {
  return getCharacterXpLogEntries(state, characterId)
    .filter(x => x.get('type') === 'grant');
}

export function getCharacterAvailableXp(state, characterId) {
  return getCharacterXpLogEntries(state, characterId)
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

export function getCharacterItems(state, characterId) {
  const character = getCharacter(state, characterId);
  if (!character) {
    return List();
  }
  return character.get('items');
}
