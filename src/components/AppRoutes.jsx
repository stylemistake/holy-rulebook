'use strict';

import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import IndexPage from './IndexPage.jsx';

export default class AppRoutes extends React.Component {
  render() {
    return (
      <BrowserRouter
        history={window.history}
        onUpdate={() => window.scrollTo(0, 0)}>
        <Route path='/' exact component={IndexPage} />
      </BrowserRouter>
    );
  }
}
