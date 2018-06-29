import { createUuid } from './utils.js';

export default class Entity {

  constructor() {
    // Unique id
    this.id = createUuid();
    // Entity type
    this.type = 'default';
  }

  fromData(data) {
    Object.assign(this, data);
    return this;
  }

}
