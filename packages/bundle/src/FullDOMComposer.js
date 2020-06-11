import PropTypes from 'prop-types';
import React from 'react';

import AdaptiveCardsComposer from './adaptiveCards/AdaptiveCardsComposer';
import { Components } from 'botframework-webchat-dom';

import useComposerProps from './useComposerProps';

const { DOMComposer } = Components;

const FullDOMComposer = props => {
  const { adaptiveCardsHostConfig, adaptiveCardsPackage, children, ...otherProps } = props;
  const composerProps = useComposerProps(props);

  return (
    <AdaptiveCardsComposer
      adaptiveCardsHostConfig={adaptiveCardsHostConfig}
      adaptiveCardsPackage={adaptiveCardsPackage}
    >
      <DOMComposer {...otherProps} {...composerProps}>
        {children}
      </DOMComposer>
    </AdaptiveCardsComposer>
  );
};

FullDOMComposer.defaultProps = {
  ...DOMComposer.defaultProps,
  adaptiveCardsHostConfig: undefined,
  adaptiveCardsPackage: undefined,
  children: undefined
};

FullDOMComposer.propTypes = {
  ...DOMComposer.propTypes,
  adaptiveCardsHostConfig: PropTypes.any,
  adaptiveCardsPackage: PropTypes.any,
  children: PropTypes.any
};

export default FullDOMComposer;
