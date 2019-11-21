import createDeferred from 'p-defer';

import createAdapters from '../../src/createAdapters';
import createQueuedArrayBufferAudioSource from './createQueuedArrayBufferAudioSource';
import fetchSpeechData from './fetchSpeechData';
import fetchSpeechCredentialsWithCache from './fetchSpeechCredentialsWithCache';

export default async function createTestHarness() {
  const {
    authorizationToken: speechServicesAuthorizationToken,
    region: speechServicesRegion
  } = await fetchSpeechCredentialsWithCache();
  const audioConfig = createQueuedArrayBufferAudioSource();
  const { directLine, webSpeechPonyfillFactory } = createAdapters({
    audioConfig,
    speechServicesAuthorizationToken,
    speechServicesRegion
  });

  return {
    directLine,
    sendTextAsSpeech: async text => {
      audioConfig.push(await fetchSpeechData({ text }));

      // Create a new SpeechRecognition session and start it.
      // By SpeechRecognition.start(), it will invoke Speech SDK to start grabbing speech data from AudioConfig.
      const { SpeechRecognition } = webSpeechPonyfillFactory();
      const recognition = new SpeechRecognition();
      const recognitionEndDeferred = createDeferred();

      recognition.onend = recognitionEndDeferred.resolve;
      recognition.onerror = ({ error }) =>
        recognitionEndDeferred.reject(error || new Error('Speech recognition failed.'));
      recognition.start();

      await recognitionEndDeferred.promise;
    },
    webSpeechPonyfillFactory
  };
}