const definitions = require('./definitions');
const Converter = require('./Converter.js');

const converter = new Converter(definitions, `${__dirname}/HE2E/`);

console.log(JSON.stringify(converter.convert(), null, 2));