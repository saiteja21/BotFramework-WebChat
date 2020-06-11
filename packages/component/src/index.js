/* global process */

import Composer from './Composer';

import Localize, { localize } from './Localization/Localize';

import concatMiddleware from './Middleware/concatMiddleware';
import connectToWebChat from './connectToWebChat';
import Context from './WebChatUIContext';
import defaultStyleOptions from './Styles/defaultStyleOptions';

import * as hooks from './hooks/index';

const version = process.env.npm_package_version;

export {
  Composer,
  concatMiddleware,
  connectToWebChat,
  Context,
  defaultStyleOptions,
  hooks,
  localize,
  Localize,
  version
};
