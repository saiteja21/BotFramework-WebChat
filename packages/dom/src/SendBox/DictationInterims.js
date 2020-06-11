/* eslint react/no-array-index-key: "off" */

import { css } from 'glamor';
import { connectToWebChat, hooks } from 'botframework-webchat-component';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Constants } from 'botframework-webchat-core';
import useStyleSet from '../hooks/useStyleSet';

const { useDictateInterims, useDictateState, useLocalizer } = hooks;

const {
  DictateState: { DICTATING, STARTING, STOPPING }
} = Constants;

const ROOT_CSS = css({
  alignItems: 'center',
  display: 'flex'
});

const connectDictationInterims = (...selectors) =>
  connectToWebChat(
    ({ dictateInterims, dictateState, language }) => ({
      dictateInterims,
      dictateState,
      language
    }),
    ...selectors
  );

const DictationInterims = ({ className }) => {
  const [dictateInterims] = useDictateInterims();
  const [dictateState] = useDictateState();
  const [{ dictationInterims: dictationInterimsStyleSet }] = useStyleSet();
  const localize = useLocalizer();

  return dictateState === STARTING || dictateState === STOPPING ? (
    <p className={classNames(dictationInterimsStyleSet + '', ROOT_CSS + '', className + '', 'status')}>
      {dictateState === STARTING && localize('SPEECH_INPUT_STARTING')}
    </p>
  ) : (
    dictateState === DICTATING &&
      (dictateInterims.length ? (
        <p className={classNames(dictationInterimsStyleSet + '', ROOT_CSS + '', className + '', 'dictating')}>
          {dictateInterims.map((interim, index) => (
            <span key={index}>
              {interim}
              &nbsp;
            </span>
          ))}
        </p>
      ) : (
        <p className={classNames(dictationInterimsStyleSet + '', ROOT_CSS + '', className + '', 'status')}>
          {localize('SPEECH_INPUT_LISTENING')}
        </p>
      ))
  );
};

DictationInterims.defaultProps = {
  className: ''
};

DictationInterims.propTypes = {
  className: PropTypes.string
};

// TODO: [P3] After speech started, when clicking on the transcript, it should
//       stop the dictation and allow the user to type-correct the transcript

export default DictationInterims;

export { connectDictationInterims };
