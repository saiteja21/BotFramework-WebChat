const ADD_CUSTOM_CHANNEL_DATA = 'WEB_CHAT/ADD_CUSTOM_CHANNEL_DATA';

const RESERVED_NAMES = ['clientActivityID', 'clientTimestamp', 'state'];
const SUPPORTED_TYPES = ['boolean', 'number', 'string'];

export default function addCustomChannelData(name, value) {
  if (RESERVED_NAMES.includes(name)) {
    throw new Error(`botframework-webchat: "${name}" is a reserved name and cannot be used in custom channel data.`);
  } else if (!SUPPORTED_TYPES.includes(typeof value)) {
    throw new Error('botframework-webchat: Only booleans, numbers, and strings are supported in custom channel data.');
  }

  return {
    type: ADD_CUSTOM_CHANNEL_DATA,
    payload: { name, value }
  };
}

export { ADD_CUSTOM_CHANNEL_DATA };
