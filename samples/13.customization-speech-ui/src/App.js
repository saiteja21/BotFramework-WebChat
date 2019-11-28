import './App.css';

import {
  Components,
  createCognitiveServicesSpeechServicesPonyfillFactory,
  createDirectLine
} from 'botframework-webchat';

import React, { useEffect, useMemo, useState } from 'react';

import fetchCognitiveServicesCredentials, { token as fetchSpeechServicesToken } from './fetchSpeechServicesCredentials';
import fetchDirectLineToken from './fetchDirectLineToken';
import SmartDisplay from './SmartDisplay';

const { AdaptiveCardsComposer, Composer } = Components;

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
        <AdaptiveCardsComposer>
          <Composer directLine={directLine} webSpeechPonyfillFactory={webSpeechPonyfillFactory}>
            <SmartDisplay />
          </Composer>
        </AdaptiveCardsComposer>
      </div>
    )
  );
};

export default App;
