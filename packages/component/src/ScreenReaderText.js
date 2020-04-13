import { css } from 'glamor';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import * as browser from '../lib/Utils/detectBrowser';

const ROOT_CSS = css({
  // .sr-only - This component is intended to be invisible to the visual Web Chat user, but read by the AT when using a screen reader
  color: 'transparent',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  // We need to set top: 0, otherwise, it will repro:
  // - Run NVDA
  // - Make the transcript long enough to show the scrollbar
  // - Press SHIFT-TAB, focus on upload button
  // - Press up arrow multiple times
  top: 0,
  whiteSpace: 'nowrap',
  width: 1
});

const ScreenReaderText = ({ id, role, text }) => {
  return (
    <span aria-label={text} className={classNames(ROOT_CSS + '')} id={id} role={role}>
      {text}
    </span>
  );
};

ScreenReaderText.defaultProps = {
  id: undefined,
  role: undefined
};

ScreenReaderText.propTypes = {
  id: PropTypes.strings,
  role: PropTypes.string,
  text: PropTypes.string.isRequired
};

export default ScreenReaderText;
