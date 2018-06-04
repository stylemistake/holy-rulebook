import Character from './Character.js';
import EventEmitter from './EventEmitter.js';

export default class GameState {

  constructor() {
    this.emitter = new EventEmitter();
    this.state = {
      masterToken: 'test',
      characters: [],
    };
  }

  createCharacter() {
    this.state.characters.push(new Character());
    this.triggerUpdate();
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
    this.triggerUpdate();
  }

  addObserver(fn) {
    this.emitter.on('update', fn);
  }

  removeObserver(fn) {
    this.emitter.off('update', fn);
  }

  triggerUpdate() {
    this.emitter.emit('update');
  }

}
