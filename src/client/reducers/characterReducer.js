import { fromJS, Map, OrderedMap, Record } from 'immutable';
import { actionTypes } from '../actions.js';
import { unhandledAction } from './index.js';

export default function characterReducer(character, action) {
  const { type, payload } = action;

  if (type === actionTypes.XP_GRANT) {
    return character.grantXp(payload.amount, {
      desc: payload.desc,
    });
  }

  if (type === actionTypes.XP_LOG_REMOVE) {
    return character.updateIn(['xpLog'], (xpLog) => {
      const index = xpLog.indexOf(payload.entry);
      return xpLog.delete(index);
    });
  }

  if (type === actionTypes.APTITUDE_APPEND) {
    return character.updateIn(['aptitudes'], (aptitudes) => {
      return aptitudes.push(payload.name);
    });
  }

  if (type === actionTypes.APTITUDE_REMOVE) {
    return character.updateIn(['aptitudes'], (aptitudes) => {
      const index = aptitudes.indexOf(payload.name);
      return aptitudes.delete(index);
    });
  }

  if (type === actionTypes.XP_BUY_CHARACTERISTIC) {
    return character.buyCharacteristic(payload.id);
  }

  if (type === actionTypes.XP_REFUND_CHARACTERISTIC) {
    return character.refundCharacteristic(payload.id);
  }

  return unhandledAction(state, action, 'characterReducer');
}

characterReducer.acceptedTypes = [
  actionTypes.XP_GRANT,
  actionTypes.XP_LOG_REMOVE,
  actionTypes.APTITUDE_APPEND,
  actionTypes.APTITUDE_REMOVE,
  actionTypes.XP_BUY_CHARACTERISTIC,
  actionTypes.XP_REFUND_CHARACTERISTIC,
];
