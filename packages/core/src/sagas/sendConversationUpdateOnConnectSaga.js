import { put } from 'redux-saga/effects';

import postActivity from '../actions/postActivity';

import whileConnected from './effects/whileConnected';

export default function* () {
  yield whileConnected(sendConversationUpdateOnConnect);
}

function* sendConversationUpdateOnConnect(_, userID) {
  yield put(postActivity({
    type: 'conversationUpdate',
    membersAdded: [{
      id: userID
    }]
  }, 'code'));
}
