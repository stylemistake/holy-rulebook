import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './createStore.js';

import './styles/index.scss';

const MOUNT_NODE = document.querySelector('.react-root');
const store = createStore();

function renderLayout() {
  try {
    const Layout = require('./layout').Layout;
    const component = (
      <Provider store={store}>
        <Layout />
      </Provider>
    );
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    ReactDOM.render(component, MOUNT_NODE);
  }
  catch (err) {
    console.error(err);
    if (process.env.NODE_ENV !== 'production') {
      const ErrorBox = require('redbox-react').default;
      const component = <ErrorBox error={err} />;
      ReactDOM.unmountComponentAtNode(MOUNT_NODE);
      ReactDOM.render(component, MOUNT_NODE);
    }
  }
}

// Make Layout component hot reloadable
if (module.hot) {
  module.hot.accept(['./layout', './store'], renderLayout);
}

window.addEventListener('load', () => {
  // Render the layout
  renderLayout();
});
