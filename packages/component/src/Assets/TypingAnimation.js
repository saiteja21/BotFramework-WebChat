import classNames from 'classnames';
import React from 'react';

import ScreenReaderText from '../ScreenReaderText';
import useDirection from '../hooks/useDirection';
import useLocalizer from '../hooks/useLocalizer';
import useStyleSet from '../hooks/useStyleSet';
import useStyleToClassName from '../hooks/internal/useStyleToClassName';

const ROOT_CSS = {
  '&.webchat__typing-animation': {
    '&.webchat__typing-animation--rtl': {
      transform: 'scale(-1, 1)'
    }
  }
};

const TypingAnimation = () => {
  const [{ typingAnimation: typingAnimationStyleSet }] = useStyleSet();
  const [direction] = useDirection();
  const localize = useLocalizer();
  const rootCSS = useStyleToClassName()(ROOT_CSS);

  return (
    <React.Fragment>
      <ScreenReaderText text={localize('TYPING_INDICATOR_ALT')} />
      <div
        aria-hidden={true}
        className={classNames(
          'webchat__typing-animation',
          rootCSS + '',
          { rtl: direction === 'webchat__typing-animation--rtl' },
          typingAnimationStyleSet + ''
        )}
      />
    </React.Fragment>
  );
};

export default TypingAnimation;
