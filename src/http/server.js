'use strict';

import path from 'path';
import http from 'http';
import Express from 'express';

// import React from 'react';
// import { renderToString } from 'react-dom/server';
// import { match, RouterContext } from 'react-router';

// import routes from '../components/routes.jsx';
// import NotFoundPage from '../components/NotFoundPage.jsx';

// initialize the server and configure support for ejs templates
const app = new Express();

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// Define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, '../../public')));

// // Universal routing and rendering
// app.get('*', (req, res) => {
//   match({ routes, location: req.url }, (err, location, props) => {
//       // in case of error display the error message
//       if (err) {
//         return res.status(500).send(err.message);
//       }

//       // in case of redirect propagate the redirect to the browser
//       if (location) {
//         return res.redirect(302, location.pathname + location.search);
//       }

//       // generate the React markup for the current route
//       let markup;
//       if (props) {
//         // if the current route matched we have props
//         markup = renderToString(<RouterContext {...props} />);
//       } else {
//         // otherwise we can render a 404 page
//         markup = renderToString(<NotFoundPage />);
//         res.status(404);
//       }

//       // render the index template with the embedded React markup
//       return res.render('index', { markup });
//     }
//   );
// });

// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
const server = new http.Server(app);
server.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});
