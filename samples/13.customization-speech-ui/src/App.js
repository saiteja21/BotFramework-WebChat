import './App.css';

import {
  Components,
  createCognitiveServicesSpeechServicesPonyfillFactory,
  createDirectLine
} from 'botframework-webchat';

import React, { useEffect, useMemo, useState } from 'react';

import Clock from './Clock';
import MicrophoneButton from './MicrophoneButton';
import LastBotActivity from './LastBotActivity';
import SpeechInterims from './SpeechInterims';

import fetchCognitiveServicesCredentials, { token as fetchSpeechServicesToken } from './fetchSpeechServicesCredentials';
import fetchDirectLineToken from './fetchDirectLineToken';

const { Composer } = Components;

const App = () => {
  const [directLineToken, setDirectLineToken] = useState();
  const [cognitiveServicesCredentials, setCognitiveServicesCredentials] = useState();

  const directLine = useMemo(
    () =>
      directLineToken &&
      createDirectLine({
        token: directLineToken
      }),
    [directLineToken]
  );

  const webSpeechPonyfillFactory = useMemo(
    () =>
      cognitiveServicesCredentials &&
      createCognitiveServicesSpeechServicesPonyfillFactory({
        authorizationToken: fetchSpeechServicesToken,
        region: cognitiveServicesCredentials.region
      }),
    [cognitiveServicesCredentials]
  );

  useEffect(() => {
    (async () => setCognitiveServicesCredentials(await fetchCognitiveServicesCredentials()))();
  }, [setCognitiveServicesCredentials]);

  useEffect(() => {
    (async () => setDirectLineToken(await fetchDirectLineToken()))();
  }, [setDirectLineToken]);

  return (
    !!directLine &&
    !!webSpeechPonyfillFactory && (
      <div>
        <Composer directLine={directLine} webSpeechPonyfillFactory={webSpeechPonyfillFactory}>
          <div className="App">
            <header className="App-header">
              <Clock />
              <SpeechInterims />
              <LastBotActivity />
              <MicrophoneButton />
            </header>
          </div>
        </Composer>
      </div>
    )
  );
};

export default App;
