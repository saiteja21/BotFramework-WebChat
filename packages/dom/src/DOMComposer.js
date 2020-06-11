import { concatMiddleware, hooks } from 'botframework-webchat-component';
import { css } from 'glamor';
import MarkdownIt from 'markdown-it';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import addTargetBlankToHyperlinksMarkdown from './Utils/addTargetBlankToHyperlinksMarkdown';
import createCoreCardActionMiddleware from './Middleware/CardAction/createCoreMiddleware';
// import createCustomEvent from './Utils/createCustomEvent';
import createStyleSet from './Styles/createStyleSet';
import observableToPromise from './Utils/observableToPromise';
import WebChatDOMContext from './WebChatDOMContext';

const { useStyleOptions } = hooks;

function createCardActionContext({ cardActionMiddleware, directLine, dispatch }) {
  const runMiddleware = concatMiddleware(cardActionMiddleware, createCoreCardActionMiddleware())({ dispatch });

  return {
    onCardAction: (cardAction, { target } = {}) =>
      runMiddleware(({ cardAction: { type } }) => {
        throw new Error(`Web Chat: received unknown card action "${type}"`);
      })({
        cardAction,
        getSignInUrl:
          cardAction.type === 'signin'
            ? () => {
                const { value } = cardAction;

                if (directLine.getSessionId) {
                  // TODO: [P3] We should change this one to async/await.
                  //       This is the first place in this project to use async.
                  //       Thus, we need to add @babel/plugin-transform-runtime and @babel/runtime.

                  return observableToPromise(directLine.getSessionId()).then(
                    sessionId => `${value}${encodeURIComponent(`&code_challenge=${sessionId}`)}`
                  );
                }

                console.warn('botframework-webchat: OAuth is not supported on this Direct Line adapter.');

                return value;
              }
            : null,
        target
      })
  };
}

// TODO: How about common utils?
function mapMap(map, mapper) {
  return Object.entries(map).reduce((result, [key, value]) => {
    result[key] = mapper(value, key);

    return result;
  }, {});
}

function styleSetToClassNames(styleSet) {
  return mapMap(styleSet, (style, key) => (key === 'options' ? style : css(style)));
}

const DOMComposer = ({ cardActionMiddleware, children, directLine, extraStyleSet, styleSet }) => {
  const [styleOptions] = useStyleOptions();

  // TODO: [RN] We should not use dispatch in cardActionMiddleware.
  const dispatch = useCallback(action => {
    console.warn('cardActionMiddleware.dispatch TODO', action);
  }, []);

  const cardActionContext = useMemo(() => createCardActionContext({ cardActionMiddleware, directLine, dispatch }), [
    cardActionMiddleware,
    directLine,
    dispatch
  ]);

  const patchedStyleSet = useMemo(
    () => styleSetToClassNames({ ...(styleSet || createStyleSet(styleOptions)), ...extraStyleSet }),
    [extraStyleSet, styleOptions, styleSet]
  );

  const internalMarkdownIt = useMemo(() => new MarkdownIt(), []);

  const internalRenderMarkdownInline = useMemo(
    () => markdown => {
      const tree = internalMarkdownIt.parseInline(markdown);

      // We should add rel="noopener noreferrer" and target="_blank"
      const patchedTree = addTargetBlankToHyperlinksMarkdown(tree);

      return internalMarkdownIt.renderer.render(patchedTree);
    },
    [internalMarkdownIt]
  );

  const context = useMemo(
    () => ({
      ...cardActionContext,
      internalMarkdownItState: [internalMarkdownIt],
      internalRenderMarkdownInline,
      styleOptions,
      styleSet: patchedStyleSet
    }),
    [cardActionContext, internalMarkdownIt, internalRenderMarkdownInline, patchedStyleSet, styleOptions]
  );

  return <WebChatDOMContext.Provider value={context}>{children}</WebChatDOMContext.Provider>;
};

DOMComposer.defaultProps = {
  cardActionMiddleware: undefined,
  children: false,
  extraStyleSet: undefined,
  styleSet: undefined
};

DOMComposer.propTypes = {
  cardActionMiddleware: PropTypes.func,
  children: PropTypes.element,
  directLine: PropTypes.any.isRequired,
  extraStyleSet: PropTypes.any,
  styleSet: PropTypes.any
};

export default DOMComposer;
