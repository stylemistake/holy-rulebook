export function contains(item) {
  return function (arrayLike) {
    return arrayLike.indexOf(item) !== -1;
  }
}

export function capitalize(str) {
  // Handle array
  if (Array.isArray(str)) {
    return str.map(capitalize);
  }
  // Handle string
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function toLowerCase(str) {
  return String(str).toLowerCase();
}

export function toUpperCase(str) {
  return String(str).toUpperCase();
}

export function toTitleCase(str) {
  // Handle array
  if (Array.isArray(str)) {
    return str.map(toTitleCase);
  }
  // Handle string
  str = String(str);
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

export function toIdentifier(str) {
  // Handle array
  if (Array.isArray(str)) {
    return str.map(toIdentifier);
  }
  // Handle string
  return cleanUpString(toLowerCase(str));
}

export function toInteger(str) {
  // Handle array
  if (Array.isArray(str)) {
    return str.map(toInteger);
  }
  // Handle string
  return parseInt(cleanUpString(str), 10);
}

export function toFloat(str) {
  // Handle array
  if (Array.isArray(str)) {
    return str.map(toFloat);
  }
  // Handle string
  return parseFloat(cleanUpString(str));
}

export function cleanUpString(str) {
  // Handle array
  if (Array.isArray(str)) {
    return str.map(cleanUpString);
  }
  // Handle string
  return String(str)
    // Remove special symbols
    .replace('†', '')
    // Remove single quotes around words
    .replace(/'(\w+([\s-]+\w+)?)'/gm, (_, group) => group)
    .trim();
}

export function filterContentBy(pattern) {
  function contentFilter(str) {
    // Handle array
    if (Array.isArray(str)) {
      return str.map(contentFilter).filter(e => e);
    }
    // Handle string
    const match = String(str).match(pattern);
    if (match) {
      return match[0];
    }
  }
  return contentFilter;
}

export function filterEmpty(array) {
  return array.filter(x => {
    if (!x) {
      return false;
    }
    if (x === '-' || x === '—' || x === '*') {
      return false;
    }
    return true;
  });
}

export function splitStringBy(delimiter) {
  return str => String(str).split(delimiter);
}
