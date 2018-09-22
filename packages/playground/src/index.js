import { css } from 'glamor';
import { createProvider } from 'react-redux';
import onErrorResumeNext from 'on-error-resume-next';
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { createStore } from '@webchattest/botframework-webchat-core';

import App from './App';
import SpeechOnlyButtonApp from './SpeechOnlyButton/index';

css.global('html, body, #root', { height: '100%' });
css.global('body', { margin: 0 });

const REDUX_STORE_KEY = 'REDUX_STORE';
const Provider = createProvider('webchat');
let store;

window.addEventListener('keydown', event => {
  const { ctrlKey, keyCode } = event;

  if (ctrlKey && keyCode === 82) {
    // CTRL-R
    sessionStorage.removeItem(REDUX_STORE_KEY);
  } else if (ctrlKey && keyCode === 83) {
    // CTRL-S
    event.preventDefault();
    store && console.log(store.getState());
  }
});

if (/speech-only-button(\.html)?/.test(window.location.href)) {
  ReactDOM.render(<SpeechOnlyButtonApp />, document.getElementById('root'));
} else {
  store = createStore(
    onErrorResumeNext(() => JSON.parse(window.sessionStorage.getItem(REDUX_STORE_KEY)))
  );

  store.subscribe(() => {
    sessionStorage.setItem(REDUX_STORE_KEY, JSON.stringify(store.getState()));
  });

  ReactDOM.render(
    <Provider store={ store }>
      <App />
    </Provider>,
  document.getElementById('root'));
}

registerServiceWorker();
