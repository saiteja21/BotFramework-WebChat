import { useCallback } from 'react';

import randomId from '../Utils/randomId';
import useReadTelemetryDimensions from './internal/useReadTelemetryDimensions';
import useTrackException from './useTrackException';
import useWebChatUIContext from './internal/useWebChatUIContext';

export default function useTrackTiming() {
  const { onTelemetry } = useWebChatUIContext();
  const readTelemetryDimensions = useReadTelemetryDimensions();
  const trackException = useTrackException();

  return useCallback(
    async (name, functionOrPromise) => {
      if (!name || typeof name !== 'string') {
        return console.warn(
          'botframework-webchat: "name" passed to "useTrackTiming" hook must be specified and of type string.'
        );
      } else if (typeof functionOrPromise !== 'function' && typeof functionOrPromise.then !== 'function') {
        return console.warn(
          'botframework-webchat: "functionOrPromise" passed to "useTrackTiming" hook must be specified, of type function or Promise.'
        );
      }

      const timingId = randomId();

      onTelemetry &&
        onTelemetry({
          dimensions: readTelemetryDimensions(),
          name,
          timingId,
          type: 'timingstart'
        });

      const startTime = Date.now();

      try {
        return await (typeof functionOrPromise === 'function' ? functionOrPromise() : functionOrPromise);
      } catch (err) {
        trackException(err, false);

        throw err;
      } finally {
        const duration = Date.now() - startTime;

        onTelemetry &&
          onTelemetry({
            dimensions: readTelemetryDimensions(),
            duration,
            name,
            timingId,
            type: 'timingend'
          });
      }
    },
    [onTelemetry, readTelemetryDimensions, trackException]
  );
}
