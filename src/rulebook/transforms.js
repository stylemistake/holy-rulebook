function compose(...transforms) {
  return str => {
    let output = str;
    for (let transform of transforms) {
      output = transform(output);
    }
    return output;
  }
}

function capitalize(str) {
  // Handle array
  if (Array.isArray(str)) {
    return str.map(capitalize);
  }
  // Handle string
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function toTitleCase(str) {
  // Handle array
  if (Array.isArray(str)) {
    return str.map(toTitleCase);
  }
  // Handle string
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

function toIdentifier(str) {
  // Handle array
  if (Array.isArray(str)) {
    return str.map(toIdentifier);
  }
  // Handle string
  return cleanUpString(str.toLowerCase());
}

function toInteger(str) {
  // Handle array
  if (Array.isArray(str)) {
    return str.map(toInteger);
  }
  // Handle string
  return parseInt(cleanUpString(str), 10);
}

function toFloat(str) {
  // Handle array
  if (Array.isArray(str)) {
    return str.map(toFloat);
  }
  // Handle string
  return parseFloat(cleanUpString(str));
}

function cleanUpString(str) {
  // Handle array
  if (Array.isArray(str)) {
    return str.map(cleanUpString);
  }
  //Handle string
  return str.replace(/†/, '').trim();
}

function filterContentBy(pattern) {
  function contentFilter(str) {
    // Handle array
    if (Array.isArray(str)) {
      return str.map(contentFilter);
    }
    // Handle string
    const match = str.match(pattern);
    if (match) {
      return match[0];
    }
    return str;
  }
  return contentFilter;
}

function splitStringBy(delimiter) {
  return str => str.split(delimiter);
}

module.exports = {
  compose,
  capitalize,
  toTitleCase,
  toIdentifier,
  toInteger,
  toFloat,
  filterContentBy,
  splitStringBy,
  cleanUpString,
};
