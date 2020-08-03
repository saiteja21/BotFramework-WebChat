const REMOVE_CUSTOM_CHANNEL_DATA = 'WEB_CHAT/REMOVE_CUSTOM_CHANNEL_DATA';

export default function removeCustomChannelData(name, value) {
  return {
    type: REMOVE_CUSTOM_CHANNEL_DATA,
    payload: { name, value }
  };
}

export { REMOVE_CUSTOM_CHANNEL_DATA };
