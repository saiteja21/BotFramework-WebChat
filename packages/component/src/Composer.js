import { Composer as SayComposer } from 'react-say';

import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import updateIn from 'simple-update-in';

import ErrorBoundary from './ErrorBoundary';
import getAllLocalizedStrings from './Localization/getAllLocalizedStrings';
import isObject from './Utils/isObject';
import normalizeLanguage from './Utils/normalizeLanguage';
import PrecompiledGlobalize from './Utils/PrecompiledGlobalize';
import useReferenceGrammarID from './hooks/useReferenceGrammarID';

import {
  clearSuggestedActions,
  connect as createConnectAction,
  createStore,
  disconnect,
  dismissNotification,
  emitTypingIndicator,
  markActivity,
  postActivity,
  sendEvent,
  sendFiles,
  sendMessage,
  sendMessageBack,
  sendPostBack,
  setDictateInterims,
  setDictateState,
  setLanguage,
  setNotification,
  setSendBox,
  setSendTimeout,
  setSendTypingIndicator,
  startDictate,
  startSpeakingActivity,
  stopDictate,
  stopSpeakingActivity,
  submitSendBox
} from 'botframework-webchat-core';

import defaultSelectVoice from './defaultSelectVoice';
import Dictation from './Dictation';
import mapMap from './Utils/mapMap';
import Tracker from './Tracker';
import WebChatReduxContext, { useDispatch } from './WebChatReduxContext';
import WebChatUIContext from './WebChatUIContext';

import {
  speechSynthesis as bypassSpeechSynthesis,
  SpeechSynthesisUtterance as BypassSpeechSynthesisUtterance
} from './Speech/BypassSpeechSynthesisPonyfill';

// List of Redux actions factory we are hoisting as Web Chat functions
const DISPATCHERS = {
  clearSuggestedActions,
  dismissNotification,
  emitTypingIndicator,
  markActivity,
  postActivity,
  sendEvent,
  sendFiles,
  sendMessage,
  sendMessageBack,
  sendPostBack,
  setDictateInterims,
  setDictateState,
  setNotification,
  setSendBox,
  setSendTimeout,
  startDictate,
  startSpeakingActivity,
  stopDictate,
  stopSpeakingActivity,
  submitSendBox
};

function createFocusContext({ mainFocusRef, sendBoxRef }) {
  return {
    focus: where => {
      const ref = where === 'sendBox' || where === 'sendBoxWithoutKeyboard' ? sendBoxRef : mainFocusRef;
      const { current } = ref || {};

      if (current) {
        if (where === 'sendBoxWithoutKeyboard') {
          // To not activate the virtual keyboard while changing focus to an input, we will temporarily set it as read-only and flip it back.
          // https://stackoverflow.com/questions/7610758/prevent-iphone-default-keyboard-when-focusing-an-input/7610923
          const readOnly = current.getAttribute('readonly');

          current.setAttribute('readonly', 'readonly');

          setTimeout(() => {
            current.focus();
            readOnly ? current.setAttribute('readonly', readOnly) : current.removeAttribute('readonly');
          }, 0);
        } else {
          current.focus();
        }
      }
    }
  };
}

function mergeStringsOverrides(localizedStrings, language, overrideLocalizedStrings) {
  if (!overrideLocalizedStrings) {
    return localizedStrings;
  } else if (typeof overrideLocalizedStrings === 'function') {
    const merged = overrideLocalizedStrings(localizedStrings, language);

    if (!isObject(merged)) {
      throw new Error('botframework-webchat: overrideLocalizedStrings function must return an object.');
    }

    return merged;
  }

  if (!isObject(overrideLocalizedStrings)) {
    throw new Error('botframework-webchat: overrideLocalizedStrings must be either a function, an object, or falsy.');
  }

  return { ...localizedStrings, ...overrideLocalizedStrings };
}

const Composer = ({
  activityRenderer,
  activityStatusRenderer,
  attachmentRenderer,
  avatarRenderer,
  children,
  dir,
  directLine,
  disabled,
  grammars,
  groupTimestamp,
  locale,
  mainFocusRef,
  onTelemetry,
  overrideLocalizedStrings,
  renderMarkdown,
  selectVoice,
  sendBoxRef,
  sendTimeout,
  sendTypingIndicator,
  styleOptions,
  toastRenderer,
  typingIndicatorRenderer,
  userID,
  username,
  webSpeechPonyfillFactory
}) => {
  const dispatch = useDispatch();
  const telemetryDimensionsRef = useRef({});
  const [referenceGrammarID] = useReferenceGrammarID();
  const [dictateAbortable, setDictateAbortable] = useState();

  const patchedDir = useMemo(() => (dir === 'ltr' || dir === 'rtl' ? dir : 'auto'), [dir]);
  const patchedGrammars = useMemo(() => grammars || [], [grammars]);

  useEffect(() => {
    dispatch(setLanguage(locale));
  }, [dispatch, locale]);

  useEffect(() => {
    typeof sendTimeout === 'number' && dispatch(setSendTimeout(sendTimeout));
  }, [dispatch, sendTimeout]);

  useEffect(() => {
    dispatch(setSendTypingIndicator(!!sendTypingIndicator));
  }, [dispatch, sendTypingIndicator]);

  useEffect(() => {
    dispatch(
      createConnectAction({
        directLine,
        userID,
        username
      })
    );

    return () => {
      // TODO: [P3] disconnect() is an async call (pending -> fulfilled), we need to wait, or change it to reconnect()
      dispatch(disconnect());
    };
  }, [dispatch, directLine, userID, username]);

  const patchedStyleOptions = useMemo(() => {
    const patchedStyleOptions = { ...styleOptions };

    if (typeof groupTimestamp !== 'undefined' && typeof patchedStyleOptions.groupTimestamp === 'undefined') {
      console.warn(
        'Web Chat: "groupTimestamp" has been moved to "styleOptions". This deprecation migration will be removed on or after January 1 2022.'
      );

      patchedStyleOptions.groupTimestamp = groupTimestamp;
    }

    if (typeof sendTimeout !== 'undefined' && typeof patchedStyleOptions.sendTimeout === 'undefined') {
      console.warn(
        'Web Chat: "sendTimeout" has been moved to "styleOptions". This deprecation migration will be removed on or after January 1 2022.'
      );

      patchedStyleOptions.sendTimeout = sendTimeout;
    }

    if (styleOptions && styleOptions.slowConnectionAfter < 0) {
      console.warn('Web Chat: "slowConnectionAfter" cannot be negative, will set to 0.');

      patchedStyleOptions.slowConnectionAfter = 0;
    }

    return patchedStyleOptions;
  }, [groupTimestamp, sendTimeout, styleOptions]);

  const patchedSelectVoice = useCallback(selectVoice || defaultSelectVoice.bind(null, { language: locale }), [
    selectVoice
  ]);

  const focusContext = useMemo(() => createFocusContext({ mainFocusRef, sendBoxRef }), [mainFocusRef, sendBoxRef]);

  const hoistedDispatchers = useMemo(
    () => mapMap(DISPATCHERS, dispatcher => (...args) => dispatch(dispatcher(...args))),
    [dispatch]
  );

  const webSpeechPonyfill = useMemo(() => {
    const ponyfill = webSpeechPonyfillFactory && webSpeechPonyfillFactory({ referenceGrammarID });
    const { speechSynthesis, SpeechSynthesisUtterance } = ponyfill || {};

    return {
      ...ponyfill,
      speechSynthesis: speechSynthesis || bypassSpeechSynthesis,
      SpeechSynthesisUtterance: SpeechSynthesisUtterance || BypassSpeechSynthesisUtterance
    };
  }, [referenceGrammarID, webSpeechPonyfillFactory]);

  const dictationOnError = useCallback(err => {
    console.error(err);
  }, []);

  const patchedLocalizedStrings = useMemo(
    () => mergeStringsOverrides(getAllLocalizedStrings()[normalizeLanguage(locale)], locale, overrideLocalizedStrings),
    [locale, overrideLocalizedStrings]
  );

  const localizedGlobalize = useMemo(() => {
    const { GLOBALIZE, GLOBALIZE_LANGUAGE } = patchedLocalizedStrings || {};

    return GLOBALIZE || (GLOBALIZE_LANGUAGE && PrecompiledGlobalize(GLOBALIZE_LANGUAGE)) || PrecompiledGlobalize('en');
  }, [patchedLocalizedStrings]);

  const trackDimension = useCallback(
    (name, data) => {
      if (!name || typeof name !== 'string') {
        return console.warn('botframework-webchat: Telemetry dimension name must be a string.');
      }

      const type = typeof data;

      if (type !== 'string' && type !== 'undefined') {
        return console.warn('botframework-webchat: Telemetry dimension data must be a string or undefined.');
      }

      telemetryDimensionsRef.current = updateIn(
        telemetryDimensionsRef.current,
        [name],
        type === 'undefined' ? data : () => data
      );
    },
    [telemetryDimensionsRef]
  );

  const scrollToEndListenersRef = useRef([]);

  const addScrollToEndListener = useCallback(
    listener => {
      if (typeof listener !== 'function') {
        throw new Error('A listener function must be passed to addScrollToEndListener().');
      }

      scrollToEndListenersRef.current = [...scrollToEndListenersRef.current, listener];

      return () => {
        scrollToEndListenersRef.current = scrollToEndListenersRef.current.filter(current => current !== listener);
      };
    },
    [scrollToEndListenersRef]
  );

  const scrollToEnd = useCallback(() => scrollToEndListenersRef.current.forEach(listener => listener()), [
    scrollToEndListenersRef
  ]);

  // This is a heavy function, and it is expected to be only called when there is a need to recreate business logic, e.g.
  // - User ID changed, causing all send* functions to be updated
  // - send

  // TODO: [P3] We should think about if we allow the user to change onSendBoxValueChanged/sendBoxValue, e.g.
  // 1. Turns text into UPPERCASE
  // 2. Filter out profanity

  // TODO: [P4] Revisit all members of context
  //       This context should consist of members that are not in the Redux store
  //       i.e. members that are not interested in other types of UIs
  const context = useMemo(
    () => ({
      ...focusContext,
      ...hoistedDispatchers,
      activityRenderer,
      activityStatusRenderer,
      addScrollToEndListener,
      attachmentRenderer,
      avatarRenderer,
      dictateAbortable,
      dir: patchedDir,
      directLine,
      disabled,
      grammars: patchedGrammars,
      language: locale,
      localizedGlobalizeState: [localizedGlobalize],
      localizedStrings: patchedLocalizedStrings,
      onTelemetry,
      renderMarkdown,
      scrollToEnd,
      selectVoice: patchedSelectVoice,
      sendBoxRef,
      sendTypingIndicator,
      setDictateAbortable,
      styleOptionsState: [patchedStyleOptions],
      trackDimension,
      telemetryDimensionsRef,
      toastRenderer,
      typingIndicatorRenderer,
      userID,
      username,
      webSpeechPonyfill
    }),
    [
      activityRenderer,
      activityStatusRenderer,
      addScrollToEndListener,
      attachmentRenderer,
      avatarRenderer,
      dictateAbortable,
      directLine,
      disabled,
      focusContext,
      hoistedDispatchers,
      locale,
      localizedGlobalize,
      onTelemetry,
      patchedDir,
      patchedGrammars,
      patchedLocalizedStrings,
      patchedSelectVoice,
      patchedStyleOptions,
      scrollToEnd,
      sendTypingIndicator,
      renderMarkdown,
      sendBoxRef,
      setDictateAbortable,
      trackDimension,
      telemetryDimensionsRef,
      toastRenderer,
      typingIndicatorRenderer,
      userID,
      username,
      webSpeechPonyfill
    ]
  );

  return (
    <WebChatUIContext.Provider value={context}>
      <SayComposer ponyfill={webSpeechPonyfill}>
        {typeof children === 'function' ? children(context) : children}
      </SayComposer>
      <Dictation onError={dictationOnError} />
      {onTelemetry && <Tracker />}
    </WebChatUIContext.Provider>
  );
};

// We will create a Redux store if it was not passed in
const ComposeWithStore = ({ onTelemetry, store, ...props }) => {
  const handleError = useCallback(
    ({ error }) => {
      onTelemetry && onTelemetry({ error, fatal: true, type: 'exception' });
    },
    [onTelemetry]
  );

  const memoizedStore = useMemo(() => store || createStore(), [store]);

  return (
    <ErrorBoundary onError={handleError}>
      <Provider context={WebChatReduxContext} store={memoizedStore}>
        <Composer onTelemetry={onTelemetry} {...props} />
      </Provider>
    </ErrorBoundary>
  );
};

ComposeWithStore.defaultProps = {
  onTelemetry: undefined,
  store: undefined
};

ComposeWithStore.propTypes = {
  onTelemetry: PropTypes.func,
  store: PropTypes.any
};

export default ComposeWithStore;

// TODO: [P3] We should consider moving some data from Redux store to props
//       Although we use `connectToWebChat` to hide the details of accessor of Redux store,
//       we should clean up the responsibility between Context and Redux store
//       We should decide which data is needed for React but not in other environment such as CLI/VSCode

Composer.defaultProps = {
  activityRenderer: undefined,
  activityStatusRenderer: undefined,
  attachmentRenderer: undefined,
  avatarRenderer: undefined,
  children: undefined,
  dir: 'auto',
  disabled: false,
  grammars: [],
  groupTimestamp: undefined,
  locale: window.navigator.language || 'en-US',
  mainFocusRef: undefined,
  onTelemetry: undefined,
  overrideLocalizedStrings: undefined,
  renderMarkdown: undefined,
  selectVoice: undefined,
  sendBoxRef: undefined,
  sendTimeout: undefined,
  sendTypingIndicator: false,
  styleOptions: undefined,
  toastRenderer: undefined,
  typingIndicatorRenderer: undefined,
  userID: '',
  username: '',
  webSpeechPonyfillFactory: undefined
};

Composer.propTypes = {
  activityRenderer: PropTypes.func,
  activityStatusRenderer: PropTypes.func,
  attachmentRenderer: PropTypes.func,
  avatarRenderer: PropTypes.func,
  children: PropTypes.any,
  dir: PropTypes.oneOf(['auto', 'ltr', 'rtl']),
  directLine: PropTypes.shape({
    activity$: PropTypes.shape({
      subscribe: PropTypes.func.isRequired
    }).isRequired,
    connectionStatus$: PropTypes.shape({
      subscribe: PropTypes.func.isRequired
    }).isRequired,
    end: PropTypes.func,
    getSessionId: PropTypes.func,
    postActivity: PropTypes.func.isRequired,
    referenceGrammarID: PropTypes.string,
    token: PropTypes.string
  }).isRequired,
  disabled: PropTypes.bool,
  grammars: PropTypes.arrayOf(PropTypes.string),
  groupTimestamp: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  locale: PropTypes.string,
  mainFocusRef: PropTypes.shape({
    current: PropTypes.any
  }),
  onTelemetry: PropTypes.func,
  overrideLocalizedStrings: PropTypes.oneOfType([PropTypes.any, PropTypes.func]),
  renderMarkdown: PropTypes.func,
  selectVoice: PropTypes.func,
  sendBoxRef: PropTypes.shape({
    current: PropTypes.any
  }),
  sendTimeout: PropTypes.number,
  sendTypingIndicator: PropTypes.bool,
  styleOptions: PropTypes.any,
  toastRenderer: PropTypes.func,
  typingIndicatorRenderer: PropTypes.func,
  userID: PropTypes.string,
  username: PropTypes.string,
  webSpeechPonyfillFactory: PropTypes.func
};
