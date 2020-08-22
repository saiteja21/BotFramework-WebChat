import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import useStyleSet from '../hooks/useStyleSet';
import VideoContent from './VideoContent';
import useStyleToClassName from '../hooks/internal/useStyleToClassName';

const ROOT_STYLE = {
  display: 'flex',
  flexDirection: 'column'
};

const VideoAttachment = ({ attachment }) => {
  const [{ videoAttachment: videoAttachmentStyleSet }] = useStyleSet();
  const rootCSS = useStyleToClassName()(ROOT_STYLE);

  return (
    <div className={classNames(rootCSS + '', videoAttachmentStyleSet + '')}>
      <VideoContent alt={attachment.name} src={attachment.contentUrl} />
    </div>
  );
};

VideoAttachment.propTypes = {
  attachment: PropTypes.shape({
    contentUrl: PropTypes.string.isRequired,
    name: PropTypes.string
  }).isRequired
};

export default VideoAttachment;
