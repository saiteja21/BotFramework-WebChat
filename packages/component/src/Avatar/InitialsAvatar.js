import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import useAvatarForBot from '../hooks/useAvatarForBot';
import useAvatarForUser from '../hooks/useAvatarForUser';
import useStyleSet from '../hooks/useStyleSet';
import useStyleToClassName from '../hooks/internal/useStyleToClassName';

const ROOT_STYLE = {
  alignItems: 'center',
  display: 'flex',

  '& .webchat__initialsAvatar__initials': {
    justifyContent: 'center'
  }
};

const InitialsAvatar = ({ fromUser }) => {
  const [{ initials: avatarInitialsForBot }] = useAvatarForBot();
  const [{ initials: avatarInitialsForUser }] = useAvatarForUser();
  const [{ initialsAvatar: initialsAvatarStyleSet }] = useStyleSet();
  const rootCSS = useStyleToClassName()(ROOT_STYLE);

  return (
    <div
      className={classNames(
        'webchat__initialsAvatar',
        rootCSS + '',
        fromUser && 'webchat__initialsAvatar--fromUser',
        initialsAvatarStyleSet + ''
      )}
    >
      <div className="webchat__initialsAvatar__initials">{fromUser ? avatarInitialsForUser : avatarInitialsForBot}</div>
    </div>
  );
};

InitialsAvatar.defaultProps = {
  fromUser: false
};

InitialsAvatar.propTypes = {
  fromUser: PropTypes.bool
};

export default InitialsAvatar;
