function printJSON(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function titleCase(str) {
  const WORD_BREAKS = [' ', '-'];
  let output = '';
  let prevChar = null;
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    output += i === 0 || WORD_BREAKS.includes(prevChar)
      ? char.toUpperCase()
      : char.toLowerCase();
    prevChar = char;
  }
  return output;
}

function cleanUpString(str) {
  return str.replace('†', '').trim();
}

module.exports = {
  printJSON,
  capitalize,
  titleCase,
  cleanUpString,
};
