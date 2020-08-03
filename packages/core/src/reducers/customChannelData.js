import updateIn from 'simple-update-in';

import { ADD_CUSTOM_CHANNEL_DATA } from '../actions/addCustomChannelData';
import { REMOVE_CUSTOM_CHANNEL_DATA } from '../actions/removeCustomChannelData';

const DEFAULT_STATE = {};

export default function customChannelData(state = DEFAULT_STATE, action) {
  const { payload, type } = action;

  if (type === ADD_CUSTOM_CHANNEL_DATA) {
    state = updateIn(state, [payload.name], (values = []) => {
      console.log(values);

      return [...values, payload.value];
    });
  } else if (type === REMOVE_CUSTOM_CHANNEL_DATA) {
    state = updateIn(state, [payload.name], values => {
      const index = values.indexOf(payload.value);

      if (~index) {
        values = updateIn(values, [index]);
      }

      return values.length ? values : undefined;
    });
  }

  return state;
}
