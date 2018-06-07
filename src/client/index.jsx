'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Layout from './Layout.jsx';
import configureStore from './configureStore.js';
import { loadState, saveState } from './actions.js';
import { debounce } from 'lodash';

import './styles/index.scss';

const MOUNT_NODE = document.querySelector('.react-root');
const store = configureStore();

function render() {
  const component = (
    <Provider store={store}>
      <Layout />
    </Provider>
  );
  ReactDOM.render(component, MOUNT_NODE);
}

// Hotswap the layout component
if (module.hot) {
  module.hot.accept(['./Layout.jsx'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render();
  });
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
  render();
  // Load state from the memory
  store.dispatch(loadState());
  // Subscribe for updates (with debounce)
  store.subscribe(_.debounce(updateListener, 100));
});
