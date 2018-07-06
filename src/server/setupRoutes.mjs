import convert from '../rulebook/convert.js';

export default function setupRoutes(router) {

  console.log('Retrieving rulebook');
  const rulebook = convert.getRulebookJson();

  router.get('/rulebook', (req, res) => {
    return res.send(rulebook);
  });

}
