import React from 'react';

import ConnectivityStatusConnected from './ConnectivityStatus/Connected';
import ConnectivityStatusConnecting from './ConnectivityStatus/Connecting';
import ConnectivityStatusFailedToConnect from './ConnectivityStatus/FailedToConnect';
import ConnectivityStatusJavaScriptError from './ConnectivityStatus/JavaScriptError';
import useDebouncedNotifications from './hooks/useDebouncedNotifications';

const BasicConnectivityStatus = () => {
  const [{ connectivitystatus: connectivityStatus }] = useDebouncedNotifications();

  if (!connectivityStatus) {
    return false;
  }

  const { message } = connectivityStatus;

  return (
    <div role="status">
      {message === 'connecting' ? (
        <ConnectivityStatusConnecting />
      ) : message === 'javascripterror' ? (
        <ConnectivityStatusJavaScriptError />
      ) : message === 'failedtoconnect' ? (
        <ConnectivityStatusFailedToConnect />
      ) : message === 'reconnecting' ? (
        <ConnectivityStatusConnecting reconnect={true} />
      ) : (
        <ConnectivityStatusConnected />
      )}
    </div>
  );
};

export default BasicConnectivityStatus;
