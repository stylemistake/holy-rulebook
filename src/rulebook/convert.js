const definitions = require('./definitions');
const Converter = require('./Converter.js');

function getRulebookJson() {
  const converter = new Converter(definitions, `${__dirname}/HE2E/`);
  return converter.convert();
}

module.exports = {
  getRulebookJson,
};

// If running this file directly
if (require.main === module) {
  const obj = getRulebookJson();
  console.log(JSON.stringify(obj, null, 2));
}
