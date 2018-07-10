import { Record, Map, List, fromJS } from 'immutable';
import { createUuid } from '../uuid.js';
import { CHARCS_PRIMARY, XP_COSTS_CHARC } from './rulebookConstants.js';

export function make() {
  return Map({
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
    skills: List(),
    talents: List(),
    xpLog: List(),
    aptitudes: List(),
  });
}

export function getCharacteristics(self) {
  return CHARCS_PRIMARY.map(meta => {
    return {
      ...meta,
      value: getCharacteristicValue(self, meta.id),
      cost: getCharacteristicXpCost(self, meta.id),
      matchingApts: countMatchingAptitudes(self, meta.aptitudes),
    };
  });
}

export function countXPPurchasesFor(self, type, id) {
  return self.get('xpLog')
    .filter(x => x.get('type') === 'spend')
    .filter(x => x.getIn(['payload', 'type']) === 'charc')
    .filter(x => x.getIn(['payload', 'id']) === id)
    .count();
}

export function countMatchingAptitudes(self, aptitudes) {
  return self.get('aptitudes')
    .filter(x => x === 'General' || aptitudes.includes(x))
    .count();
}

export function getCharacteristicValue(self, id) {
  const initial = self.getIn(['charcs', id]);
  const purchases = countXPPurchasesFor(self, 'charc', id);
  return initial + purchases * 5;
}

export function getCharacteristicAptitudes(self, id) {
  return CHARCS_PRIMARY.find(x => x.id === id).aptitudes;
}

export function getCharacteristicXpCost(self, id) {
  const aptitudes = getCharacteristicAptitudes(self, id);
  const aptCount = countMatchingAptitudes(self, aptitudes);
  const purchases = countXPPurchasesFor(self, 'charc', id);
  return XP_COSTS_CHARC[aptCount][purchases];
}

export function buyCharacteristic(self, id) {
  const cost = getCharacteristicXpCost(self, id);
  if (!cost) {
    console.log(`Can't buy more of characteristic "${id}"`);
    return self;
  }
  return spendXp(self, cost, { type: 'charc', id });
}

export function refundCharacteristic(self, id) {
  return refundXp(self, { type: 'charc', id });
}

export function getAvailableXp(self) {
  return self.get('xpLog')
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

export function getSpentXpLogEntries(self) {
  return self.get('xpLog')
    .filter(x => x.get('type') === 'spend');
}

export function getGrantedXpLogEntries(self) {
  return self.get('xpLog')
    .filter(x => x.get('type') === 'grant');
}

export function spendXp(self, amount, payload) {
  const entry = Map({
    type: 'spend',
    payload: Map(payload),
    amount,
  });
  return self.updateIn(['xpLog'], x => x.push(entry));
}

export function grantXp(self, amount, payload) {
  const entry = Map({
    type: 'grant',
    amount,
    payload: Map(payload),
  });
  return self.updateIn(['xpLog'], x => x.push(entry));
}

export function refundXp(self, payload) {
  return self.updateIn(['xpLog'], xpLog => {
    const lastEntryIndex = xpLog.findLastKey(x => {
      return x.get('type') === 'spend'
        && Map(payload).isSubset(x.get('payload'));
    });
    return xpLog.delete(lastEntryIndex);
  });
}
