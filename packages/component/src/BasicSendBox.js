import { Constants } from 'botframework-webchat-core';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import DictationInterims from './SendBox/DictationInterims';
import MicrophoneButton from './SendBox/MicrophoneButton';
import SendButton from './SendBox/SendButton';
import SuggestedActions from './SendBox/SuggestedActions';
import TextBox from './SendBox/TextBox';
import UploadButton from './SendBox/UploadButton';
import useActivities from './hooks/useActivities';
import useDictateState from './hooks/useDictateState';
import useDirection from './hooks/useDirection';
import useStyleOptions from './hooks/useStyleOptions';
import useStyleSet from './hooks/useStyleSet';
import useStyleToClassName from './hooks/internal/useStyleToClassName';
import useWebSpeechPonyfill from './hooks/useWebSpeechPonyfill';

const {
  DictateState: { DICTATING, STARTING }
} = Constants;

const ROOT_STYLE = {
  '&.webchat__basic-send-box': {
    '& .webchat__basic-send-box__main': {
      display: 'flex'
    },

    '& .webchat__basic-send-box__dictation-interims': {
      flex: 10000
    },

    '& .webchat__basic-send-box__microphone-button': {
      flex: 1
    },

    '& .webchat__basic-send-box__text-box': {
      flex: 10000
    }
  }
};

// TODO: [P3] We should consider exposing core/src/definitions and use it instead
function activityIsSpeakingOrQueuedToSpeak({ channelData: { speak } = {} }) {
  return !!speak;
}

function useSendBoxSpeechInterimsVisible() {
  const [activities] = useActivities();
  const [dictateState] = useDictateState();

  return [
    (dictateState === STARTING || dictateState === DICTATING) &&
      !activities.filter(activityIsSpeakingOrQueuedToSpeak).length
  ];
}

const BasicSendBox = ({ className }) => {
  const [{ hideUploadButton }] = useStyleOptions();
  const [{ sendBox: sendBoxStyleSet }] = useStyleSet();
  const [{ SpeechRecognition } = {}] = useWebSpeechPonyfill();
  const [direction] = useDirection();
  const [speechInterimsVisible] = useSendBoxSpeechInterimsVisible();
  const rootCSS = useStyleToClassName()(ROOT_STYLE);

  const supportSpeechRecognition = !!SpeechRecognition;

  return (
    <div
      className={classNames('webchat__basic-send-box', rootCSS + '', sendBoxStyleSet + '', className + '')}
      dir={direction}
      role="form"
    >
      <SuggestedActions />
      <div className="webchat__basic-send-box__main">
        {!hideUploadButton && <UploadButton />}
        {speechInterimsVisible ? (
          <DictationInterims className="webchat__basic-send-box__dictation-interims" />
        ) : (
          <TextBox className="webchat__basic-send-box__text-box" />
        )}
        <div>
          {supportSpeechRecognition ? (
            <MicrophoneButton className="webchat__basic-send-box__microphone-button" />
          ) : (
            <SendButton />
          )}
        </div>
      </div>
    </div>
  );
};

BasicSendBox.defaultProps = {
  className: ''
};

BasicSendBox.propTypes = {
  className: PropTypes.string
};

export default BasicSendBox;

export { useSendBoxSpeechInterimsVisible };
