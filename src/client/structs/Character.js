import { Record, Map, List, fromJS } from 'immutable';
import { createUuid } from '../utils.js';

const RecordFactory = Record({
  id: null,
  name: null,
  state: Map({
    damage: 0,
    fatigue: 0,
    corruption: 0,
    stress: 0,
    fate: 4,
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
    inf: 20,
    wounds: 10,
    fp: 0,
  }),
  skills: List(),
  talents: List(),
  xpLog: List(),
  aptitudes: List(),
});

const CHARCS_META = fromJS([
  { id: 'ws',     name: 'Weapon skill' },
  { id: 'bs',     name: 'Ballistic skill' },
  { id: 's',      name: 'Strength' },
  { id: 't',      name: 'Toughness' },
  { id: 'ag',     name: 'Agility' },
  { id: 'int',    name: 'Intelligence' },
  { id: 'per',    name: 'Perception' },
  { id: 'wp',     name: 'Willpower' },
  { id: 'fel',    name: 'Fellowship' },
  { id: 'status', name: 'Status' },
  { id: 'inf',    name: 'Influence' },
  { id: 'wounds', name: 'Wounds' },
  { id: 'fp',     name: 'Fate points' },
]);

export default class Character extends RecordFactory {

  static make() {
    return new this({
      id: createUuid(),
      name: 'New character',
    });
  }

  getCharcs() {
    return CHARCS_META.map((x) => {
      const value = this.getIn(['charcs', x.get('id')]);
      return x.merge({ value });
    });
  }

  getXP() {
    return this.get('xpLog')
      .map(x => x.get('amount'))
      .reduce((a, b) => a + b);
  }

}
