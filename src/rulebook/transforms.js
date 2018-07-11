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
  const WORDS_UPPER = ['Id', 'Tv'];
  const WORDS_LOWER = [
    'A', 'An', 'And', 'As', 'At', 'But', 'By', 'For', 'For', 'From', 'In', 'Into',
    'Near', 'Nor', 'Of', 'On', 'Onto', 'Or', 'The', 'To', 'With',
  ];
  let currentStr = str.replace(/([^\W_]+[^\s-]*) */g, str => {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  });
  for (let word of WORDS_LOWER) {
    const regex = new RegExp('\\s' + word + '\\s', 'g');
    currentStr = currentStr.replace(regex, str => str.toLowerCase());
  }
  for (let word of WORDS_UPPER) {
    const regex = new RegExp('\\b' + word + '\\b', 'g');
    currentStr = currentStr.replace(regex, str => str.toLowerCase());
  }
  return currentStr;
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
  return str
    // Remove special symbols
    .replace('†', '')
    // Remove single quotes around words
    .replace(/'(\w+([\s-]+\w+)?)'/gm, (_, group) => group)
    .trim();
}

function filterContentBy(pattern) {
  function contentFilter(str) {
    // Handle array
    if (Array.isArray(str)) {
      return str.map(contentFilter).filter(e => e);
    }
    // Handle string
    const match = str.match(pattern);
    if (match) {
      return match[0];
    }
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
