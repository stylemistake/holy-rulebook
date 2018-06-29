'use strict';

import Entity from './Entity.js';
import store from './store.js';

export default class Section extends Entity {

  constructor() {
    super();
    this.type = 'section';
  }

  getSubSections() {
    console.debug('getSubSections()', this.subsections);
    // Handle this as a query string
    if (typeof this.subsections === 'string') {
      return store.queryAll(this.subsections);
    }
    // Handle this as an array of subsection objects
    if (Array.isArray(this.subsections)) {
      return this.subsections.map((x) => new Section().fromData(x));
    }
    // Return nothing
    return null;
  }

}
