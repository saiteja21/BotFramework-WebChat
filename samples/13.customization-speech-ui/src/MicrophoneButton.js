import './MicrophoneButton.css';

import { hooks } from 'botframework-webchat';
import classNames from 'classnames';
import React from 'react';

import MicrophoneIcon from './MicrophoneIcon';

const { useMicrophoneButtonClick, useMicrophoneButtonDisabled, useSendBoxDictationStarted } = hooks;

const CustomMicrophoneButton = () => {
  const [dictating] = useSendBoxDictationStarted();
  const [disabled] = useMicrophoneButtonDisabled();
  const click = useMicrophoneButtonClick();

  return (
    <button className={classNames('App-MicrophoneButton', { dictating })} disabled={disabled} onClick={click}>
      <i className="ms-Icon ms-Icon--Microphone" />
      {/* <MicrophoneIcon size="10vmin" /> */}
    </button>
  );
};

export default CustomMicrophoneButton;
