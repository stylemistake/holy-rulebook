'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore.js';
import { loadState, saveState } from './actions.js';
import { debounce } from 'lodash';

import './styles/index.scss';

const MOUNT_NODE = document.querySelector('.react-root');
const store = configureStore();

function renderLayout() {
  try {
    const Layout = require('./Layout.jsx').default;
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
      ReactDOM.render(component, MOUNT_NODE);
    }
  }
}

// Hot module reload
if (module.hot) {
  module.hot.accept('./Layout.jsx', renderLayout);
}

// Update listener
// Saves changes when timestamp is newer than the previous one
let lastUpdatedAt = null;
function updateListener() {
  const state = store.getState();
  const updatedAt = state.get('updatedAt');
  // Dispatch a save action
  if (updatedAt > lastUpdatedAt) {
    store.dispatch(saveState(state));
  }
  // Update the timestamp
  lastUpdatedAt = updatedAt;
}

window.addEventListener('load', () => {
  // Render the layout
  renderLayout();
  // Load state from the memory
  store.dispatch(loadState());
  // Subscribe for updates (with debounce)
  store.subscribe(_.debounce(updateListener, 100));
});
