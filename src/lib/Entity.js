'use strict';

export default class Entity {

  constructor() {
    // Unique id
    this._id = Math.random().toString(16).substr(2);
    // Entity type
    this.type = 'default';
  }

  fromData(data) {
    Object.assign(this, data);
    return this;
  }

}
