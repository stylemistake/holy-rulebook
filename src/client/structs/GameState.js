import { Record, OrderedMap, fromJS } from 'immutable';
import { createUuid } from '../utils.js';
import Character from './Character.js';

const RecordFactory = Record({
  id: null,
  name: null,
  characters: OrderedMap(),
});

export default class GameState extends RecordFactory {

  static make() {
    const uuid = createUuid();
    return new this({
      id: uuid,
      name: `Gamestate [${uuid.substr(0, 8) + '...'}]`,
    });
  }

  toJS() {
    return this
      .update('characters', (x) => x.toList())
      .toJS();
  }

  getCharacters() {
    return this.get('characters');
  }

  getCharacter(id) {
    return this.getIn(['characters', id]);
  }

  createCharacter() {
    const character = Character.make();
    return this.setIn(['characters', character.id], character);
  }

  updateCharacter(id, updater) {
    return this.updateIn(['characters', id], updater);
  }

  removeCharacter(id) {
    return this.deleteIn(['characters', id]);
  }

}
