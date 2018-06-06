import Character from './Character.js';
import store from './store.js';
import { uuid } from './utils.js';

export default class GameState {

  constructor(obj) {
    this.id = uuid();
    this.name = `Gamestate [${this.id.substr(0, 8) + '...'}]`;
    this.masterToken = null;
    this.characters = [];
    // Initialize from object
    Object.assign(this, obj);
    this.characters = this.characters.map(x => new Character(x));
  }

  createCharacter() {
    this.characters.push(new Character());
    store.dispatch();
  }

  getCharacters() {
    return this.characters;
  }

  getCharacter(id) {
    return this.characters.find(x => x.id === id);
  }

  removeCharacter(id) {
    const index = this.characters.findIndex(x => x.id === id);
    this.characters.splice(index, 1);
    store.dispatch();
  }

}
