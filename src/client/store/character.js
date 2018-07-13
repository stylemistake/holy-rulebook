import { Map } from 'immutable';

function updateCharacter(state, action, updater) {
  const { characterId } = action.payload;
  return state.updateIn(['characters', characterId], character => {
    return updater(character).set('updatedAt', action.meta.updatedAt);
  });
}

function addXpLogEntry(character, type, amount, payload) {
  const filteredPayload = Map(payload).filter(x => !!x);
  const entry = Map({
    type, amount,
    payload: filteredPayload,
  });
  return character.update('xpLog', x => x.push(entry));
}

function grantXp(character, amount, payload) {
  return addXpLogEntry(character, 'grant', amount, payload);
}

function spendXp(character, amount, payload) {
  return addXpLogEntry(character, 'spend', amount, payload);
}

function refundXp(character, payload) {
  const filteredPayload = Map(payload).filter(x => !!x);
  return character.update('xpLog', xpLog => {
    const lastEntryIndex = xpLog.findLastKey(entry => {
      return entry.get('type') === 'spend'
        && filteredPayload.isSubset(entry.get('payload'));
    });
    return xpLog.delete(lastEntryIndex);
  });
}

export function characterReducer(state, action) {
  const { type, payload, meta } = action;

  if (type === 'CHARACTER_CREATE') {
    const { character } = payload;
    const characterId = character.get('id');
    return state.setIn(['characters', characterId],
      character.set('updatedAt', meta.updatedAt));
  }

  if (type === 'CHARACTER_REMOVE') {
    const { characterId } = payload;
    return state.deleteIn(['characters', characterId]);
  }

  if (type === 'CHARACTER_VALUE_UPDATE') {
    return updateCharacter(state, action, character => {
      const { path, value } = payload;
      return character.setIn(path, value);
    });
  }

  if (type === 'CHARACTER_XP_GRANT') {
    return updateCharacter(state, action, character => {
      const { amount, desc } = payload;
      return grantXp(character, amount, { desc });
    });
  }

  if (type === 'CHARACTER_XP_LOG_REMOVE') {
    return updateCharacter(state, action, character => {
      const { entry } = payload;
      return character.update('xpLog', xpLog => {
        const index = xpLog.indexOf(entry);
        return xpLog.delete(index);
      });
    });
  }

  if (type === 'CHARACTER_XP_FREEZE_TOGGLE') {
    return updateCharacter(state, action, character => {
      return character.set('xpFrozen', payload.value);
    });
  }

  if (type === 'CHARACTER_APTITUDE_ADD') {
    return updateCharacter(state, action, character => {
      const { aptitudeName } = payload;
      return character.update('aptitudes', aptitudes => {
        return aptitudes.push(aptitudeName);
      });
    });
  }

  if (type === 'CHARACTER_APTITUDE_REMOVE') {
    return updateCharacter(state, action, character => {
      const { aptitudeName } = payload;
      return character.update('aptitudes', aptitudes => {
        const index = aptitudes.indexOf(aptitudeName);
        return aptitudes.delete(index);
      });
    });
  }

  if (type === 'CHARACTER_CHARACTERISTIC_BUY') {
    return updateCharacter(state, action, character => {
      const { charcId, cost } = payload;
      if (cost === undefined) {
        return character;
      }
      // Account for frozen XP
      const adjustedCost = character.get('xpFrozen') ? 0 : cost;
      return spendXp(character, adjustedCost, {
        type: 'charc',
        id: charcId,
      });
    });
  }

  if (type === 'CHARACTER_CHARACTERISTIC_REFUND') {
    return updateCharacter(state, action, character => {
      const { charcId } = payload;
      return refundXp(character, {
        type: 'charc',
        id: charcId,
      });
    });
  }

  if (type === 'CHARACTER_SKILL_BUY') {
    return updateCharacter(state, action, character => {
      const { skillName, skillSpec, cost } = payload;
      if (cost === undefined) {
        return character;
      }
      // Account for frozen XP
      const adjustedCost = character.get('xpFrozen') ? 0 : cost;
      return spendXp(character, adjustedCost, {
        type: 'skill',
        name: skillName,
        spec: skillSpec,
      });
    });
  }

  if (type === 'CHARACTER_SKILL_REFUND') {
    return updateCharacter(state, action, character => {
      const { skillName, skillSpec } = payload;
      return refundXp(character, {
        type: 'skill',
        name: skillName,
        spec: skillSpec,
      });
    });
  }

  if (type === 'CHARACTER_TALENT_BUY') {
    return updateCharacter(state, action, character => {
      const { talentName, talentSpec, cost } = payload;
      if (cost === undefined) {
        return character;
      }
      // Account for frozen XP
      const adjustedCost = character.get('xpFrozen') ? 0 : cost;
      return spendXp(character, adjustedCost, {
        type: 'talent',
        name: talentName,
      });
    });
  }

  if (type === 'CHARACTER_TALENT_REFUND') {
    return updateCharacter(state, action, character => {
      const { talentName, talentSpec } = payload;
      return refundXp(character, {
        type: 'talent',
        name: talentName,
      });
    });
  }

  return state;
}
