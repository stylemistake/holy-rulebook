'use strict';

export default class Entity {

  fromData(data) {
    Object.assign(this, data);
    return this;
  }

}
