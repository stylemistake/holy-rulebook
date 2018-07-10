import convert from '../rulebook/convert.js';
import { acceptConnection } from './relay.mjs';
import { createLogger } from './logger.mjs';

const logger = createLogger('setupRoutes');
const PUBLIC_DIR = process.cwd() + '/public';

export default function setupRoutes(router) {

  logger.log('Retrieving rulebook');
  const rulebook = convert.getRulebookJson();

  router.get('/rulebook', (req, res) => {
    return res.send(rulebook);
  });

  router.ws('/relay', (ws, req) => {
    acceptConnection(ws);
  });

  router.use((req, res) => {
    return res.sendFile(PUBLIC_DIR + '/index.html');
  });

}
