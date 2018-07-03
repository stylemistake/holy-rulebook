import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { fromJS } from 'immutable';
import { createReducer } from './reducers.js';

// Refer to https://github.com/flexdinesh/react-redux-boilerplate

export default function configureStore(initialState) {
  const middlewares = [
    thunk,
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
  const store = createStore(createReducer(), fromJS(initialState),
    composeEnhancers(...enhancers));

  // Make reducers hot reloadable, see http://mxs.is/googmo
  if (module.hot) {
    module.hot.accept('./reducers.js', () => {
      const { createReducer } = require('./reducers.js');
      store.replaceReducer(createReducer());
    });
  }

  return store;
}
