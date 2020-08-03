import { useEffect } from 'react';

import useWebChatUIContext from './internal/useWebChatUIContext';

export default function useChannelData(name, value) {
  const { addCustomChannelData, removeCustomChannelData } = useWebChatUIContext();

  useEffect(() => {
    addCustomChannelData(name, value);

    return () => {
      removeCustomChannelData(name, value);
    };
  }, [addCustomChannelData, removeCustomChannelData]);
}
