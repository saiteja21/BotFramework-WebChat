import {
  put,
  take
} from 'redux-saga/effects';

import whileConnected from './effects/whileConnected';

import { SEND_FILES } from '../actions/sendFiles';
import postActivity from '../actions/postActivity';
import stopSpeakingActivity from '../actions/stopSpeakingActivity';

export default function* () {
  yield whileConnected(function* () {
    for (;;) {
      const { payload: { files } } = yield take(SEND_FILES);

      if (files.length) {
        yield put(postActivity({
          attachments: files.map(file => ({
            contentType: 'application/octet-stream',
            contentUrl: file.url,
            name: file.name
          })),
          channelData: {
            attachmentSizes: files.map(file => file.size)
          },
          type: 'message'
        }));

        yield put(stopSpeakingActivity());
      }
    }
  });
}