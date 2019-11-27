import { hooks } from 'botframework-webchat';
import classNames from 'classnames';
import React from 'react';

import MicrophoneIcon from './MicrophoneIcon';

const { useMicrophoneButtonClick, useMicrophoneButtonDisabled, useSendBoxDictationStarted } = hooks;

const CustomMicrophoneButton = ({ className }) => {
  const [dictating] = useSendBoxDictationStarted();
  const [disabled] = useMicrophoneButtonDisabled();
  const click = useMicrophoneButtonClick();

  return (
    <button className={classNames(className, { dictating })} disabled={disabled} onClick={click}>
      <MicrophoneIcon size="10vmin" />
    </button>
  );
};

export default CustomMicrophoneButton;
