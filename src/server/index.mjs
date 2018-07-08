import path from 'path';
import http from 'http';
import Express from 'express';
import setupExpressWs from 'express-ws';
import setupRoutes from './setupRoutes.mjs';

// Get configuration
const port = process.env.PORT || 3000;
const env = process.argv.includes('--dev') && 'local'
  || process.env.NODE_ENV
  || 'production';

async function require(uri) {
  return (await import(uri)).default;
}

async function setupServer() {
  // Create Express app
  const app = new Express();

  // Create HTTP server
  const server = new http.Server(app);

  // Setup websockets
  setupExpressWs(app, server, {});

  // Define the folder that will be used for static assets
  app.use(Express.static('./public'));

  // Setup Webpack
  if (env === 'local') {
    const setupWebpack = await require('./setupWebpack.mjs');
    setupWebpack(app);
  }

  // Setup routes
  setupRoutes(app);

  // Start the server
  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.info(`Server running on http://localhost:${port} [${env}]`);
  });
}

setupServer().catch((e) => {
  console.error(e);
  process.exit(1);
});
