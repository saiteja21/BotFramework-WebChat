import { useContext } from 'react';

import WebChatDOMContext from '../../WebChatDOMContext';

export default function useWebChatDOMContext() {
  const context = useContext(WebChatDOMContext);

  if (!context) {
    throw new Error('This hook can only be used on a component that is a descendant of <DOMComposer>');
  }

  return context;
}
