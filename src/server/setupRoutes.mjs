import convert from '../rulebook/convert.js';
import EventEmitter from 'events';

let LATEST_STATE = {};
const emitter = new EventEmitter();

export default function setupRoutes(router) {

  console.log('Retrieving rulebook');
  const rulebook = convert.getRulebookJson();

  router.get('/rulebook', (req, res) => {
    return res.send(rulebook);
  });

  router.ws('/relay', (ws, req) => {
    let updatedAt;
    console.log('Client has connected to relay');
    ws.on('message', (msg) => {
      const state = JSON.parse(msg);
      if (!LATEST_STATE.updatedAt || state.updatedAt > LATEST_STATE.updatedAt) {
        LATEST_STATE = state;
        emitter.emit('updated');
      }
    });
    ws.send(JSON.stringify(LATEST_STATE));
    const handleUpdatedState = () => {
      if (!updatedAt || LATEST_STATE.updatedAt > updatedAt) {
        ws.send(JSON.stringify(LATEST_STATE));
      }
    };
    emitter.on('updated', handleUpdatedState);
    ws.on('close', () => {
      console.log('Client disconnected from relay');
      emitter.off('updated', handleUpdatedState);
    });
  });

}
