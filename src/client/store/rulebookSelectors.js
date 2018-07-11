import { Map, List, fromJS } from 'immutable';
import * as rulebookConstants from './rulebookConstants.js';

export function getRulebookCharacteristics(state) {
  return fromJS(rulebookConstants.CHARCS_PRIMARY);
}

export function getRulebookCharacteristicXpCosts(state, matchingAptitudes, currentTier) {
  return fromJS(rulebookConstants.XP_COSTS_CHARC)
    .getIn([matchingAptitudes, currentTier]);
}

export function getRulebookSkills(state) {
  const skills = state.getIn(['rulebook', 'skills'])
  if (!skills) {
    return List();
  }
  return skills
    .map(skill => skill.set('displayName', skill.get('name')))
    .sortBy(skill => skill.get('name'));
}

export function getRulebookSpecSkills(state) {
  return getRulebookSkills(state)
    .map(skill => {
      const skillName = skill.get('name');
      const skillSpecs = skill.get('specializations');
      if (skillSpecs.count() === 0) {
        return List().push(skill);
      }
      return skillSpecs.map(spec => {
        const specName = spec.get('name');
        return skill
          .set('displayName', `${skillName} [${specName}]`)
          .set('specialization', specName);
      });
    })
    .reduce((list, skills) => list.concat(skills), List());
}

export function getRulebookSkillXpCosts(state, matchingAptitudes, currentTier) {
  return fromJS(rulebookConstants.XP_COSTS_SKILL)
    .getIn([matchingAptitudes, currentTier]);
}

export function getRulebookSkillTierBonus(state, tier) {
  return fromJS(rulebookConstants.SKILL_TIER_CHARC_BONUS).get(tier);
}
