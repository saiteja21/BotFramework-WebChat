import { createStore } from '@webchattest/botframework-webchat-core';
import ReactWebChat, {
  concatMiddleware,
  Context,
  createStyleSet
} from '@webchattest/botframework-webchat-component';

import createDirectLine from './createDirectLine';
import coreRenderWebChat from './renderWebChat';

const renderWebChat = coreRenderWebChat.bind(null, ReactWebChat)

export default ReactWebChat

export {
  concatMiddleware,
  Context,
  createDirectLine,
  createStore,
  createStyleSet,
  renderWebChat
}

window['WebChat'] = {
  ...window['WebChat'],
  concatMiddleware,
  Context,
  createDirectLine,
  createStore,
  createStyleSet,
  renderWebChat,
  ReactWebChat
};
