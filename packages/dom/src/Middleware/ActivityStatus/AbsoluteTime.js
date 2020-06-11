import { hooks } from 'botframework-webchat-component';
import PropTypes from 'prop-types';
import React from 'react';

import ScreenReaderText from '../../ScreenReaderText';

const { useDateFormatter, useLocalizer } = hooks;

const AbsoluteTime = ({ value }) => {
  const localize = useLocalizer();
  const formatDate = useDateFormatter();

  const absoluteTime = formatDate(value);

  return (
    <React.Fragment>
      <ScreenReaderText text={localize('ACTIVITY_STATUS_SEND_STATUS_ALT_SENT_AT', absoluteTime)} />
      <span aria-hidden={true}>{absoluteTime}</span>
    </React.Fragment>
  );
};

AbsoluteTime.propTypes = {
  value: PropTypes.string.isRequired
};

export default AbsoluteTime;
