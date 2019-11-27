import './App.css';

import {
  Components,
  createCognitiveServicesSpeechServicesPonyfillFactory,
  createDirectLine
} from 'botframework-webchat';

import React, { useEffect, useMemo, useState } from 'react';

import CustomDictationInterims from './CustomDictationInterims';
import CustomMicrophoneButton from './CustomMicrophoneButton';

import fetchCognitiveServicesCredentials, { token as fetchSpeechServicesToken } from './fetchSpeechServicesCredentials';

import LastBotActivity from './LastBotActivity';
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
      <Composer directLine={directLine} webSpeechPonyfillFactory={webSpeechPonyfillFactory}>
        <div className="App">
          <header className="App-header">
            <CustomMicrophoneButton className="App-speech-button" />
            <CustomDictationInterims className="App-speech-interims" />
            <LastBotActivity className="App-bot-activity" />
          </header>
        </div>
      </Composer>
    )
  );
};

export default App;
