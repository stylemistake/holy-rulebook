import Character from './Character.js';
import store from './store.js';
import { uuid } from './utils.js';

export default class GameState {

  constructor(obj) {
    this.id = uuid();
    this.name = `Gamestate [${this.id.substr(0, 8) + '...'}]`;
    this.state = {
      masterToken: null,
      characters: [],
    };
    // Initialize from object
    Object.assign(this, obj);
    this.state.characters = this.state.characters.map(x => new Character(x));
  }

  createCharacter() {
    this.state.characters.push(new Character());
    store.triggerUpdate();
  }

  getCharacters() {
    return this.state.characters;
  }

  getCharacter(id) {
    return this.state.characters.find(x => x.id === id);
  }

  removeCharacter(id) {
    const index = this.state.characters.findIndex(x => x.id === id);
    this.state.characters.splice(index, 1);
    store.triggerUpdate();
  }

}
