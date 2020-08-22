/* eslint no-magic-numbers: ["error", { "ignore": [0, 1, 2] }] */
/* eslint react/no-unsafe: off */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import AccessKeySinkSurface from './Utils/AccessKeySink/Surface';
import BasicConnectivityStatus from './BasicConnectivityStatus';
import BasicSendBox from './BasicSendBox';
import BasicToaster from './BasicToaster';
import BasicTranscript from './BasicTranscript';
import TypeFocusSinkBox from './Utils/TypeFocusSink';
import useDisabled from './hooks/useDisabled';
import useSendBoxFocusRef from './hooks/internal/useSendBoxFocusRef';
import useStyleOptions from './hooks/useStyleOptions';
import useStyleSet from './hooks/useStyleSet';
import useStyleToClassName from './hooks/internal/useStyleToClassName';
import useTranscriptFocusRef from './hooks/internal/useTranscriptFocusRef';

const ROOT_STYLE = {
  '&.webchat__basic-web-chat': {
    display: 'flex',
    flexDirection: 'column',

    '& .webchat__basic-web-chat__connectivity-status': {
      flexShrink: 0
    },

    '& .webchat__basic-web-chat__send-box': {
      flexShrink: 0
    },

    '& .webchat__basic-web-chat__toaster': {
      flexShrink: 0
    },

    '& .webchat__basic-web-chat__transcript': {
      flex: 1
    },

    '& .webchat__basic-web-chat__type-focus-sink': {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      overflow: 'hidden'
    }
  }
};

const BasicWebChat = ({ className }) => {
  const [{ root: rootStyleSet }] = useStyleSet();
  const [disabled] = useDisabled();
  const [options] = useStyleOptions();
  const [sendBoxFocusRef] = useSendBoxFocusRef();
  const [transcriptFocusRef] = useTranscriptFocusRef();
  const rootCSS = useStyleToClassName()(ROOT_STYLE);

  return (
    <AccessKeySinkSurface
      className={classNames('webchat__basic-web-chat', rootCSS + '', rootStyleSet + '', className + '')}
    >
      <TypeFocusSinkBox
        className="webchat__basic-web-chat__type-focus-sink"
        disabled={disabled}
        ref={transcriptFocusRef}
        role="complementary"
        sendFocusRef={sendBoxFocusRef}
      >
        {!options.hideToaster && <BasicToaster className="webchat__basic-web-chat__toaster" />}
        <BasicTranscript className="webchat__basic-web-chat__transcript" />
        <BasicConnectivityStatus className="webchat__basic-web-chat__connectivity-status" />
        {!options.hideSendBox && <BasicSendBox className="webchat__basic-web-chat__send-box" />}
      </TypeFocusSinkBox>
    </AccessKeySinkSurface>
  );
};

export default BasicWebChat;

BasicWebChat.defaultProps = {
  className: ''
};

BasicWebChat.propTypes = {
  className: PropTypes.string
};
