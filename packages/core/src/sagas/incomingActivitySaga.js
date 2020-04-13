import { call, put, race, select, take } from 'redux-saga/effects';
import updateIn from 'simple-update-in';

import { ofType as activitiesOfType } from '../selectors/activities';
import activityFromBot from '../definitions/activityFromBot';
import incomingActivity, { INCOMING_ACTIVITY } from '../actions/incomingActivity';
import observeEvery from './effects/observeEvery';
import setSuggestedActions from '../actions/setSuggestedActions';
import sleep from '../utils/sleep';
import whileConnected from './effects/whileConnected';

function patchActivityWithFromRole(activity, userID) {
  // Some activities, such as "ConversationUpdate", does not have "from" defined.
  // And although "role" is defined in Direct Line spec, it was not sent over the wire.
  // We normalize the activity here to simplify null-check and logic later.

  // Patch activity.from.role to make sure its either "bot", "user", or "channel"
  if (!activity.from) {
    activity = updateIn(activity, ['from', 'role'], () => 'channel');
  } else if (!activity.from.role) {
    if (activity.from.id === userID) {
      activity = updateIn(activity, ['from', 'role'], () => 'user');
    } else if (activity.from.id) {
      activity = updateIn(activity, ['from', 'role'], () => 'bot');
    } else {
      activity = updateIn(activity, ['from', 'role'], () => 'channel');
    }
  }

  return activity;
}

function* observeActivity({ directLine, userID }) {
  yield observeEvery(directLine.activity$, function* observeActivity(activity) {
    activity = patchActivityWithFromRole(activity, userID);

    // In Direct Line, the bot reply often received before the read receipt of user request.
    // This cause the transcript updated in a non-linear way.

    // The solution is to hold on all incoming activities if the anticipating read receipt has not received.
    // We will only hold activities for up to 300 ms.

    if (activity.from.role !== 'user') {
      yield race([
        call(sleep, 300),
        call(function*() {
          for (;;) {
            yield take(INCOMING_ACTIVITY);

            const { activities } = yield select();
            const { length: numPendingSend } = activities.filter(
              ({ channelData: { state } = {}, from: { role } }) => role === 'user' && state === 'sending'
            );

            if (!numPendingSend) {
              break;
            }
          }
        })
      ]);
    }

    yield put(incomingActivity(activity));

    // Update suggested actions
    // TODO: [P3] We could put this logic inside reducer to minimize number of actions dispatched.
    const messageActivities = yield select(activitiesOfType('message'));
    const lastMessageActivity = messageActivities[messageActivities.length - 1];

    if (activityFromBot(lastMessageActivity)) {
      const { suggestedActions: { actions, to } = {} } = lastMessageActivity;

      // If suggested actions is not destined to anyone, or is destined to the user, show it.
      // In other words, if suggested actions is destined to someone else, don't show it.
      yield put(setSuggestedActions(to && to.length && !to.includes(userID) ? null : actions));
    }
  });
}

export default function* incomingActivitySaga() {
  yield whileConnected(observeActivity);
}
