import { Record, Map, List, fromJS } from 'immutable';
import { createUuid } from '../utils.js';

const RecordFactory = Record({
  id: null,
  name: null,
  state: Map({
    wounds: 0,
    fatigue: 0,
    corruption: 0,
    stress: 0,
    fate: 4,
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

const CHARCS_METADATA = [
  {
    id: 'ws',
    name: 'Weapon skill',
    aptitudes: ['Weapon Skill', 'Offense'],
  },
  {
    id: 'bs',
    name: 'Ballistic skill',
    aptitudes: ['Ballistic Skill', 'Finesse'],
  },
  {
    id: 's',
    name: 'Strength',
    aptitudes: ['Strength', 'Offense'],
  },
  {
    id: 't',
    name: 'Toughness',
    aptitudes: ['Toughness', 'Defense'],
  },
  {
    id: 'ag',
    name: 'Agility',
    aptitudes: ['Agility', 'Finesse'],
  },
  {
    id: 'int',
    name: 'Intelligence',
    aptitudes: ['Intelligence', 'Knowledge'],
  },
  {
    id: 'per',
    name: 'Perception',
    aptitudes: ['Perception', 'Fieldcraft'],
  },
  {
    id: 'wp',
    name: 'Willpower',
    aptitudes: ['Willpower', 'Psyker'],
  },
  {
    id: 'fel',
    name: 'Fellowship',
    aptitudes: ['Fellowship', 'Social'],
  },
  // {
  //   id: 'status',
  //   name: 'Status',
  // },
  // {
  //   id: 'inf',
  //   name: 'Influence',
  // },
  // {
  //   id: 'wounds',
  //   name: 'Wounds',
  // },
  // {
  //   id: 'fp',
  //   name: 'Fate points',
  // },
];

// matching aptitudes -> tier -> xp cost
const XP_COSTS_CHARC = [
  [500, 750, 1000, 1500, 2500],
  [250, 500, 750, 1000, 1500],
  [100, 250, 500, 750, 1250],
];

export default class Character extends RecordFactory {

  static make() {
    return new this({
      id: createUuid(),
      name: 'New character',
    });
  }

  getCharacteristics() {
    return CHARCS_METADATA.map(meta => {
      return Object.assign({}, meta, {
        value: this.getCharacteristicValue(meta.id),
        cost: this.getCharacteristicXpCost(meta.id),
        matchingApts: this.countMatchingAptitudes(meta.aptitudes),
      });
    });
  }

  countXPPurchasesFor(type, id) {
    return this.get('xpLog')
      .filter(x => x.get('type') === 'spend')
      .filter(x => x.getIn(['payload', 'type']) === 'charc')
      .filter(x => x.getIn(['payload', 'id']) === id)
      .count();
  }

  countMatchingAptitudes(aptitudes) {
    return this.get('aptitudes')
      .filter(x => x === 'General' || aptitudes.includes(x))
      .count();
  }

  getCharacteristicValue(id) {
    const initial = this.getIn(['charcs', id]);
    const purchases = this.countXPPurchasesFor('charc', id);
    return initial + purchases * 5;
  }

  getCharacteristicAptitudes(id) {
    return CHARCS_METADATA.find(x => x.id === id).aptitudes;
  }

  getCharacteristicXpCost(id) {
    const aptitudes = this.getCharacteristicAptitudes(id);
    const aptCount = this.countMatchingAptitudes(aptitudes);
    const purchases = this.countXPPurchasesFor('charc', id);
    return XP_COSTS_CHARC[aptCount][purchases];
  }

  buyCharacteristic(id) {
    const cost = this.getCharacteristicXpCost(id);
    if (!cost) {
      console.log(`Can't buy more of characteristic "${id}"`);
      return this;
    }
    return this.spendXp(cost, { type: 'charc', id });
  }

  refundCharacteristic(id) {
    return this.refundXp({ type: 'charc', id });
  }

  getAvailableXp() {
    return this.get('xpLog')
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

  getSpentXpLogEntries() {
    return this.get('xpLog')
      .filter(x => x.get('type') === 'spend');
  }

  getGrantedXpLogEntries() {
    return this.get('xpLog')
      .filter(x => x.get('type') === 'grant');
  }

  spendXp(amount, payload) {
    const entry = Map({
      type: 'spend',
      payload: Map(payload),
      amount,
    });
    return this.updateIn(['xpLog'], x => x.push(entry));
  }

  grantXp(amount, payload) {
    const entry = Map({
      type: 'grant',
      amount,
      payload: Map(payload),
    });
    return this.updateIn(['xpLog'], x => x.push(entry));
  }

  refundXp(payload) {
    return this.updateIn(['xpLog'], xpLog => {
      const lastEntryIndex = xpLog.findLastKey(x => {
        return x.get('type') === 'spend'
          && Map(payload).isSubset(x.get('payload'));
      });
      return xpLog.delete(lastEntryIndex);
    });
  }

}
