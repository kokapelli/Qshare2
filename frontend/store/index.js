import {createStore, applyMiddleware, compose} from 'redux';
import reducers from '../reducers';
import thunk from 'redux-thunk';
import { fetchPlaylist } from '../actions/queue'

export default function configureStore(initialState) {
  const middlewares = [
    thunk,
  ];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools


  const store =  createStore(reducers, initialState, composeEnhancers(
    applyMiddleware(...middlewares)
    )
  );

  if (process.env.NODE_ENV === 'test') {
    store.dispatch(fetchPlaylist());
  }


  return store;
};