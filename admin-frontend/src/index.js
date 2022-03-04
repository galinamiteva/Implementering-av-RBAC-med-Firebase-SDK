import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
 applyMiddleware, combineReducers, compose, createStore
} from 'redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { firebaseReducer, ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore';
import logger from 'redux-logger';
import { I18nextProvider } from 'react-i18next';
import * as serviceWorker from './serviceWorker';
import App from './App';
import i18n from './i18n/index';

const fbConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
};

// Initialize firebase instance
firebase.initializeApp(fbConfig);
firebase.firestore();

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer
});

const middlewares = [];
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

// Create store with reducers and middleware
const store = createStore(
  rootReducer,
  compose(applyMiddleware(...middlewares))
);

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
};

ReactDOM.render((
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReactReduxFirebaseProvider>
    </I18nextProvider>
  </Provider>
), document.getElementById('root'));

serviceWorker.unregister();
