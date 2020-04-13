import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import AbsoluteTime from './AbsoluteTime';
import RelativeTime from './RelativeTime';
import ScreenReaderText from '../../ScreenReaderText';
import useDateFormatter from '../../hooks/useDateFormatter';
import useLocalizer from '../../hooks/useLocalizer';
import useStyleOptions from '../../hooks/useStyleOptions';
import useStyleSet from '../../hooks/useStyleSet';

const Timestamp = ({ activity: { timestamp }, className }) => {
  const [{ timestampFormat }] = useStyleOptions();
  const [{ timestamp: timestampStyleSet, sendStatus: sendStatusStyleSet }] = useStyleSet();
  const formatDate = useDateFormatter();
  const localize = useLocalizer();

  const absoluteTime = useMemo(() => formatDate(timestamp), [timestamp]);

  timestampStyleSet &&
    console.warn(
      'botframework-webchat: "styleSet.timestamp" is deprecated. Please use "styleSet.sendStatus". This deprecation migration will be removed on or after December 31, 2021.'
    );

  return (
    !!timestamp && (
      <span
        className={classNames((timestampStyleSet || '') + '', (sendStatusStyleSet || '') + '', (className || '') + '')}
        role="presentation"
      >
        <ScreenReaderText text={localize('ACTIVITY_STATUS_SEND_STATUS_ALT_SENT_AT', absoluteTime)} />
        <span aria-hidden={true} role="presentation">
          {timestampFormat === 'relative' ? <RelativeTime value={timestamp} /> : <AbsoluteTime value={timestamp} />}
        </span>
      </span>
    )
  );
};

Timestamp.defaultProps = {
  className: ''
};

Timestamp.propTypes = {
  activity: PropTypes.shape({
    timestamp: PropTypes.string.isRequired
  }).isRequired,
  className: PropTypes.string
};

export default Timestamp;
