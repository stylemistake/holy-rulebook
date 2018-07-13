import { Map, List, fromJS } from 'immutable';
import * as rulebookConstants from './rulebookConstants.js';

//  Utility functions
// --------------------------------------------------------

/**
 * Does a "left join" of a collection with another collection, which is located inside
 * first collection object's property.
 */
function unwind(coll, pathToOtherColl, unwinderFn) {
  return coll
    .map(item => {
      const otherColl = item.getIn(pathToOtherColl);
      if (otherColl.count() === 0) {
        return List().push(item);
      }
      return otherColl.map(otherItem => {
        return unwinderFn(item, otherItem);
      });
    })
    .reduce((result, items) => result.concat(items), List());
}


//  Characteristics
// --------------------------------------------------------

export function getRulebookCharacteristics(state) {
  return fromJS(rulebookConstants.CHARCS_PRIMARY);
}

export function getRulebookCharacteristicXpCosts(state, matchingApts, tier) {
  return fromJS(rulebookConstants.XP_COSTS_CHARC)
    .getIn([matchingApts, tier]);
}


//  Skills
// --------------------------------------------------------

export function getRulebookSkills(state) {
  const skills = state.getIn(['rulebook', 'skills'])
  if (!skills) {
    return List();
  }
  return skills
    .map(skill => skill.set('displayName', skill.get('name')))
    .sortBy(skill => skill.get('name'));
}

export function getRulebookSkillsWithSpecs(state) {
  const skills = getRulebookSkills(state);
  return unwind(skills, ['specializations'], (skill, spec) => {
    const name = skill.get('name');
    const specName = spec.get('name');
    return skill
      .set('displayName', `${name} [${specName}]`)
      .set('specialization', spec);
  });
}

export function getRulebookSkillXpCosts(state, matchingApts, tier) {
  return fromJS(rulebookConstants.XP_COSTS_SKILL)
    .getIn([matchingApts, tier]);
}

export function getRulebookSkillTierBonus(state, tier) {
  return fromJS(rulebookConstants.SKILL_TIER_CHARC_BONUS).get(tier);
}


//  Talents
// --------------------------------------------------------

export function getRulebookTalents(state) {
  const talents = state.getIn(['rulebook', 'talents'])
  if (!talents) {
    return List();
  }
  return talents
    .map(skill => skill.set('displayName', skill.get('name')))
    .sortBy(skill => skill.get('name'));
}

export function getRulebookTalentsWithSpecs(state) {
  const talents = getRulebookTalents(state);
  return unwind(talents, ['specializations'], (talent, spec) => {
    const name = talent.get('name');
    const specName = spec.get('name');
    return talent
      .set('displayName', `${name} [${specName}]`)
      .set('specialization', spec);
  });
}

export function getRulebookTalentXpCosts(state, matchingApts, tier) {
  return fromJS(rulebookConstants.XP_COSTS_TALENT)
    .getIn([matchingApts, tier]);
}
