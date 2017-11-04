'use strict';

const yaml = require('js-yaml');

module.exports = function (source) {
  this.cacheable && this.cacheable();
  try {
    const obj = yaml.safeLoadAll(source);
    if (!obj) {
      return 'module.exports = undefined';
    }
    const serialized = JSON.stringify(obj)
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');
    return 'module.exports = ' + serialized;
  }
  catch (err) {
    this.emitError(err);
    return null;
  }
}
