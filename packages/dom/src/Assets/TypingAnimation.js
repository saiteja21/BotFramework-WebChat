import { css } from 'glamor';
import { hooks } from 'botframework-webchat-component';
import classNames from 'classnames';
import React from 'react';

import ScreenReaderText from '../ScreenReaderText';
import useStyleSet from '../hooks/useStyleSet';

const { useDirection, useLocalizer } = hooks;

const RTL_SCALE_CSS = css({ transform: 'scale(-1, 1)' });

const TypingAnimation = () => {
  const [{ typingAnimation: typingAnimationStyleSet }] = useStyleSet();
  const [direction] = useDirection();
  const localize = useLocalizer();

  const rtlScale = direction === 'rtl' ? RTL_SCALE_CSS + '' : '';

  return (
    <React.Fragment>
      <ScreenReaderText text={localize('TYPING_INDICATOR_ALT')} />
      <div
        aria-hidden={true}
        className={classNames('webchat__typingIndicator', rtlScale + '', typingAnimationStyleSet + '')}
      />
    </React.Fragment>
  );
};

export default TypingAnimation;
