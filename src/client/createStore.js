import { createStore as createReduxStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createSemaphoreMiddleware } from 'redux-semaphore';
import { fromJS } from 'immutable';
import { globalReducer } from './state';

// Refer to https://github.com/flexdinesh/react-redux-boilerplate
export default function createStore() {
  const middlewares = [
    thunk,
    createSemaphoreMiddleware(),
  ];
  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  const useDevtoolsCompose = process.env.NODE_ENV !== 'production'
    && typeof window === 'object'
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

  const composeEnhancers = useDevtoolsCompose
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      shouldHotReload: false,
    })
    : compose;

  // Create store
  const store = createReduxStore(globalReducer,
    composeEnhancers(...enhancers));

  // Make reducers hot reloadable
  if (module.hot) {
    module.hot.accept('./state', () => {
      const { globalReducer } = require('./state');
      store.replaceReducer(globalReducer);
    });
  }

  return store;
}
