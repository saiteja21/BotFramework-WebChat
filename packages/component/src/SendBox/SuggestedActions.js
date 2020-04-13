/* eslint react/no-array-index-key: "off" */

import { css } from 'glamor';
import BasicFilm from 'react-film';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import connectToWebChat from '../connectToWebChat';
import ScreenReaderText from '../ScreenReaderText';
import SuggestedAction from './SuggestedAction';
import useDirection from '../hooks/useDirection';
import useLocalizer from '../hooks/useLocalizer';
import useStyleOptions from '../hooks/useStyleOptions';
import useStyleSet from '../hooks/useStyleSet';

const SUGGESTED_ACTION_STACKED_CSS = css({
  display: 'flex',
  flexDirection: 'column'
});

function suggestedActionText({ displayText, title, type, value }) {
  if (type === 'messageBack') {
    return title || displayText;
  } else if (title) {
    return title;
  } else if (typeof value === 'string') {
    return value;
  }

  return JSON.stringify(value);
}

const connectSuggestedActions = (...selectors) =>
  connectToWebChat(
    ({ language, suggestedActions }) => ({
      language,
      suggestedActions
    }),
    ...selectors
  );

const SuggestedActions = ({ className, suggestedActions = [] }) => {
  const [{ suggestedActionLayout, suggestedActionsStyleSet: suggestedActionsStyleSetForReactFilm }] = useStyleOptions();
  const [{ suggestedActions: suggestedActionsStyleSet }] = useStyleSet();
  const [direction] = useDirection();
  const localize = useLocalizer();

  const suggestedActionsContainerText = localize(
    'SUGGESTED_ACTIONS_ALT',
    suggestedActions.length
      ? localize('SUGGESTED_ACTIONS_ALT_HAS_CONTENT')
      : localize('SUGGESTED_ACTIONS_ALT_NO_CONTENT')
  );

  const ariaOrientation = suggestedActionLayout === 'stacked' ? undefined : 'horizontal';

  if (!suggestedActions.length) {
    return (
      <div aria-live="polite" aria-orientation={ariaOrientation} role="menu">
        <ScreenReaderText text={suggestedActionsContainerText} />
      </div>
    );
  }

  const children = suggestedActions.map(({ displayText, image, text, title, type, value }, index) => (
    <SuggestedAction
      ariaHidden={true}
      buttonText={suggestedActionText({ displayText, title, type, value })}
      displayText={displayText}
      image={image}
      key={index}
      text={text}
      type={type}
      value={value}
    />
  ));

  if (suggestedActionLayout === 'stacked') {
    return (
      <div aria-live="polite" aria-orientation={ariaOrientation} role="menu">
        <ScreenReaderText text={suggestedActionsContainerText} />
        <div
          aria-atomic={true}
          className={classNames(suggestedActionsStyleSet + '', SUGGESTED_ACTION_STACKED_CSS + '', className + '')}
          role="presentation"
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div aria-live="polite" aria-orientation={ariaOrientation} role="menu">
      <ScreenReaderText text={suggestedActionsContainerText} />
      <div aria-atomic={true} role="presentation">
        <BasicFilm
          autoCenter={false}
          className={classNames(suggestedActionsStyleSet + '', className + '')}
          dir={direction}
          flipperBlurFocusOnClick={true}
          showDots={false}
          styleSet={suggestedActionsStyleSetForReactFilm}
        >
          {children}
        </BasicFilm>
      </div>
    </div>
  );
};

SuggestedActions.defaultProps = {
  className: ''
};

SuggestedActions.propTypes = {
  className: PropTypes.string,
  suggestedActions: PropTypes.arrayOf(
    PropTypes.shape({
      displayText: PropTypes.string,
      image: PropTypes.string,
      text: PropTypes.string,
      title: PropTypes.string,
      type: PropTypes.string.isRequired,
      value: PropTypes.any
    })
  ).isRequired
};

export default connectSuggestedActions()(SuggestedActions);

export { connectSuggestedActions };
