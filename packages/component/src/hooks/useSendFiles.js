/* eslint no-magic-numbers: ["error", { "ignore": [0, 1024] }] */

// TODO: [RN] Fix downscaleImageToDataURL in React Native
/* eslint no-unused-vars: "off" */
/* eslint require-await: "off" */
/* eslint react-hooks/exhaustive-deps: "off" */

import { useCallback } from 'react';

// TODO: [RN] Fix downscaleImageToDataURL in React Native
// import downscaleImageToDataURL from '../Utils/downscaleImageToDataURL';
import useStyleOptions from '../hooks/useStyleOptions';
import useTrackEvent from '../hooks/useTrackEvent';
import useTrackTiming from '../hooks/useTrackTiming';
import useWebChatUIContext from './internal/useWebChatUIContext';

// TODO: [RN] Fix downscaleImageToDataURL in React Native
// function canMakeThumbnail({ name }) {
//   return /\.(gif|jpe?g|png)$/iu.test(name);
// }

// TODO: [RN] Fix downscaleImageToDataURL in React Native
// async function makeThumbnail(file, width, height, contentType, quality) {
//   try {
//     return await downscaleImageToDataURL(file, width, height, contentType, quality);
//   } catch (error) {
//     console.warn(`Web Chat: Failed to downscale image due to ${error}.`);
//   }
// }

export default function useSendFiles() {
  const { sendFiles } = useWebChatUIContext();
  const [
    {
      enableUploadThumbnail,
      uploadThumbnailContentType,
      uploadThumbnailHeight,
      uploadThumbnailQuality,
      uploadThumbnailWidth
    }
  ] = useStyleOptions();
  const trackEvent = useTrackEvent();
  const trackTiming = useTrackTiming();

  return useCallback(
    async files => {
      if (files && files.length) {
        files = [].slice.call(files);

        // TODO: [P3] We need to find revokeObjectURL on the UI side
        //       Redux store should not know about the browser environment
        //       One fix is to use ArrayBuffer instead of object URL, but that would requires change to DirectLineJS
        const attachments = await Promise.all(
          [].map.call(files, async file => {
            let thumbnail;

            // TODO: [RN] Fix downscaleImageToDataURL in React Native
            // if (enableUploadThumbnail && canMakeThumbnail(file)) {
            //   thumbnail = await trackTiming(
            //     'sendFiles:makeThumbnail',
            //     makeThumbnail(
            //       file,
            //       uploadThumbnailWidth,
            //       uploadThumbnailHeight,
            //       uploadThumbnailContentType,
            //       uploadThumbnailQuality
            //     )
            //   );
            // }

            return {
              name: file.name,
              size: file.size,
              url: window.URL.createObjectURL(file),
              ...(thumbnail && { thumbnail })
            };
          })
        );

        sendFiles(attachments);

        trackEvent('sendFiles', {
          numFiles: files.length,
          sumSizeInKB: Math.round(files.reduce((total, { size }) => total + size, 0) / 1024)
        });
      }
    },
    [
      enableUploadThumbnail,
      sendFiles,
      trackEvent,
      trackTiming,
      uploadThumbnailContentType,
      uploadThumbnailHeight,
      uploadThumbnailQuality,
      uploadThumbnailWidth
    ]
  );
}
