import * as Character from './characterClass.js';

function updateCharacter(state, characterId, updater) {
  return state.updateIn(['characters', characterId], updater);
}

export function characterReducer(state, action) {
  const { type, payload, meta } = action;

  if (type === 'CHARACTER_CREATE') {
    const { character } = payload;
    return state.setIn(['characters', character.get('id')],
      character.set('updatedAt', meta.updatedAt));
  }

  if (type === 'CHARACTER_SELECT') {
    const { characterId } = payload;
    return state.set('activeCharacterId', characterId);
  }

  if (type === 'CHARACTER_REMOVE') {
    const { characterId } = payload;
    return state.deleteIn(['characters', characterId]);
  }

  if (type === 'CHARACTER_VALUE_UPDATE') {
    const { characterId, path, value } = payload;
    return updateCharacter(state, characterId, character => {
      return character.setIn(path, value)
        .set('updatedAt', meta.updatedAt);
    });
  }

  if (type === 'CHARACTER_XP_GRANT') {
    const { characterId, amount, desc } = payload;
    return updateCharacter(state, characterId, character => {
      return Character.grantXp(character, amount, { desc })
        .set('updatedAt', meta.updatedAt);
    });
  }

  if (type === 'CHARACTER_XP_LOG_REMOVE') {
    const { characterId } = payload;
    return updateCharacter(state, characterId, character => {
      return character
        .updateIn(['xpLog'], xpLog => {
          const index = xpLog.indexOf(payload.entry);
          return xpLog.delete(index);
        })
        .set('updatedAt', meta.updatedAt);
    });
  }

  if (type === 'CHARACTER_APTITUDE_ADD') {
    const { characterId, aptitudeName } = payload;
    return updateCharacter(state, characterId, character => {
      return character
        .updateIn(['aptitudes'], aptitudes => {
          return aptitudes.push(aptitudeName);
        })
        .set('updatedAt', meta.updatedAt);
    });
  }

  if (type === 'CHARACTER_APTITUDE_REMOVE') {
    const { characterId, aptitudeName } = payload;
    return updateCharacter(state, characterId, character => {
      return character
        .updateIn(['aptitudes'], aptitudes => {
          const index = aptitudes.indexOf(aptitudeName);
          return aptitudes.delete(index);
        })
        .set('updatedAt', meta.updatedAt);
    });
  }

  if (type === 'CHARACTER_CHARACTERISTIC_BUY') {
    const { characterId, charcId } = payload;
    return updateCharacter(state, characterId, character => {
      return Character.buyCharacteristic(character, charcId)
        .set('updatedAt', meta.updatedAt);
    });
  }

  if (type === 'CHARACTER_CHARACTERISTIC_REFUND') {
    const { characterId, charcId } = payload;
    return updateCharacter(state, characterId, character => {
      return Character.refundCharacteristic(character, charcId)
        .set('updatedAt', meta.updatedAt);
    });
  }

  return state;
}
