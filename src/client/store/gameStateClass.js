import { Map, Set } from 'immutable';
import { createUuid } from '../uuid.js';
import * as Character from './characterClass.js';

export function make() {
  const uuid = createUuid();
  return new Map({
    id: uuid,
    name: `Gamestate [${uuid.substr(0, 8) + '...'}]`,
    characters: Set(),
  });
}

export function getCharacters(self) {
  return self.get('characters');
}

export function getCharacter(self, id) {
  return self.getIn(['characters', id]);
}

export function createCharacter(self) {
  const character = Character.make();
  return self.setIn(['characters', character.get('id')], character);
}

export function updateCharacter(self, id, updater) {
  return self.updateIn(['characters', id], updater);
}

export function removeCharacter(self, id) {
  return self.deleteIn(['characters', id]);
}
