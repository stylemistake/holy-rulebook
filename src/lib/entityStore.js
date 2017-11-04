const requireRulebook = require.context('../rulebook', true, /\.y?aml$/);

/**
 * Query an entity.
 * Example uri: /skills/acrobatics
 *
 * @param  {string} uri
 * @return {any}
 */
export function queryEntity(uri) {
  console.log(requireRulebook.keys());
  return requireRulebook('.' + uri + '.yaml');
}
