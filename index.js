'use strict';

// Setup Toml loader
require('toml-require').install({
  toml: require('toml'),
});

// List of collections
const collections = [
  'descriptions',
  'homeworlds',
];

// Fill the data
const data = {};
for (let x of collections) {
  Object.assign(data, require('./collections/' + x + '.toml'));
}

// Output the data
console.log(JSON.stringify(data));
