/**
 * Helper for conditionally adding/removing classes in React
 *
 * @return {string}
 */
export function classes() {
  const classNames = [];
  const hasOwn = Object.prototype.hasOwnProperty;
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i];
    if (!arg) {
      continue;
    }
    if (typeof arg === 'string' || typeof arg === 'number') {
      classNames.push(arg);
    }
    else if (Array.isArray(arg) && arg.length) {
      const inner = classes.apply(null, arg);
      if (inner) {
        classNames.push(inner);
      }
    }
    else if (typeof arg === 'object') {
      for (let key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classNames.push(key);
        }
      }
    }
  }
  return classNames.join(' ');
};

/**
 * UUID v4 string generator
 *
 * @return {string}
 */
export function uuid() {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
