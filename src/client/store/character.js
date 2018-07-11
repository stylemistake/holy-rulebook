import { Map } from 'immutable';

function updateCharacter(state, action, updater) {
  const { characterId } = action.payload;
  return state.updateIn(['characters', characterId], character => {
    return updater(character).set('updatedAt', action.meta.updatedAt);
  });
}

function addXpLogEntry(character, type, amount, payload) {
  const entry = Map({
    type, amount,
    payload: Map(payload),
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
  return character.update('xpLog', xpLog => {
    const lastEntryIndex = xpLog.findLastKey(entry => {
      return entry.get('type') === 'spend'
        && Map(payload).isSubset(entry.get('payload'));
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
      return spendXp(character, cost, {
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
      return spendXp(character, cost, {
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

  return state;
}
