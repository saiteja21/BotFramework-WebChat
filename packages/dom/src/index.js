/* global process */

import * as hooks from './hooks/index';
import BasicWebChat from './BasicWebChat';

import Avatar from './Activity/Avatar';
import Bubble from './Activity/Bubble';
import CarouselLayout from './Activity/CarouselLayout';
import DOMComposer from './DOMComposer';
import ErrorBox from './ErrorBox';

import SendStatus, { connectSendStatus } from './Middleware/ActivityStatus/SendStatus/SendStatus';
import SpeakActivity, { connectSpeakActivity } from './Activity/Speak';
import StackedLayout, { connectStackedLayout } from './Activity/StackedLayout';
import Timestamp from './Middleware/ActivityStatus/Timestamp';

import AudioContent from './Attachment/AudioContent';
import FileContent from './Attachment/FileContent';
import HTMLVideoContent from './Attachment/HTMLVideoContent';
import ImageContent from './Attachment/ImageContent';
import TextContent from './Attachment/TextContent';
import VideoContent from './Attachment/VideoContent';
import VimeoContent from './Attachment/VimeoContent';
import YouTubeContent from './Attachment/YouTubeContent';

import DictationInterims, { connectDictationInterims } from './SendBox/DictationInterims';
import MicrophoneButton, { connectMicrophoneButton } from './SendBox/MicrophoneButton';
import SendButton, { connectSendButton } from './SendBox/SendButton';
import SendTextBox, { connectSendTextBox } from './SendBox/TextBox';
import SuggestedActions, { connectSuggestedActions } from './SendBox/SuggestedActions';
import UploadButton, { connectUploadButton } from './SendBox/UploadButton';

import createCoreActivityMiddleware from './Middleware/Activity/createCoreMiddleware';
import createCoreActivityStatusMiddleware from './Middleware/ActivityStatus/createCoreMiddleware';
import createCoreAttachmentMiddleware from './Middleware/Attachment/createCoreMiddleware';
import createStyleSet from './Styles/createStyleSet';
import getTabIndex from './Utils/TypeFocusSink/getTabIndex';

const version = process.env.npm_package_version;

export default BasicWebChat;

const Components = {
  DOMComposer,

  // Components for recomposing activities and attachments
  AudioContent,
  FileContent,
  HTMLVideoContent,
  ImageContent,
  TextContent,
  VideoContent,
  VimeoContent,
  YouTubeContent,

  // Components for recomposing transcript
  Avatar,
  Bubble,
  CarouselLayout,
  ErrorBox,
  SendStatus,
  SpeakActivity,
  StackedLayout,
  Timestamp,

  connectSendStatus,
  connectSpeakActivity,
  connectStackedLayout,

  // Components for recomposing send box
  DictationInterims,
  MicrophoneButton,
  SendButton,
  SendTextBox,
  SuggestedActions,
  UploadButton,

  connectDictationInterims,
  connectMicrophoneButton,
  connectSendButton,
  connectSendTextBox,
  connectSuggestedActions,
  connectUploadButton
};

export {
  Components,
  createCoreActivityMiddleware,
  createCoreActivityStatusMiddleware,
  createCoreAttachmentMiddleware,
  createStyleSet,
  getTabIndex,
  hooks,
  version
};
