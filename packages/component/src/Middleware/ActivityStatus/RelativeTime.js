import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import ScreenReaderText from '../../ScreenReaderText';
import useDateFormatter from '../../hooks/useDateFormatter';
import useForceRenderAtInterval from '../../hooks/internal/useForceRenderAtInterval';
import useLocalizer from '../../hooks/useLocalizer';
import useRelativeTimeFormatter from '../../hooks/useRelativeTimeFormatter';

const TIMER_INTERVAL = 60000;

const RelativeTime = ({ value }) => {
  const formatDate = useDateFormatter();
  const formatRelativeTime = useRelativeTimeFormatter();
  const localize = useLocalizer();

  const absoluteTime = useMemo(() => formatDate(value), [value]);

  useForceRenderAtInterval(value, TIMER_INTERVAL);

  return (
    <React.Fragment>
      <ScreenReaderText text={localize('ACTIVITY_STATUS_SEND_STATUS_ALT_SENT_AT', absoluteTime)} />
      <span aria-hidden={true}>{formatRelativeTime(value)}</span>
    </React.Fragment>
  );
};

RelativeTime.propTypes = {
  value: PropTypes.string.isRequired
};

export default RelativeTime;
