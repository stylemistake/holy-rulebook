// Entry point for testing conversion
(async () => {
  const { getRulebook } = await import('./index.mjs');
  const obj = getRulebook();
  console.log(JSON.stringify(obj, null, 2));
})();
