import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import React from 'react';

import AdaptiveCardRenderer from './AdaptiveCardRenderer';

import { AdaptiveCard } from 'adaptivecards';

function stripSubmitAction(card) {
  if (!card.actions) {
    return card;
  }

  // Filter out HTTP action buttons
  const nextActions = card.actions
    .filter(action => action.type !== 'Action.Submit')
    .map(action =>
      action.type === 'Action.ShowCard' ?
        { ...action, card: stripSubmitAction(action.card) }
      :
        action
    );

  return { ...card, nextActions };
}

export default class AdaptiveCardAttachment extends React.Component {
  constructor(props) {
    super(props);

    this.createAdaptiveCard = memoize((adaptiveCards, content) => {
      const card = new adaptiveCards.AdaptiveCard();
      const errors = [];

      // TODO: [P3] Move from "onParseError" to "card.parse(json, errors)"
      adaptiveCards.AdaptiveCard.onParseError = error => errors.push(error);

      card.parse(stripSubmitAction({
        version: '1.0',
        ...content
      }));

      AdaptiveCard.onParseError = null;

      return {
        card,
        errors
      };
    });
  }

  render() {
    const { props: { adaptiveCards, attachment } } = this;
    const { card } = this.createAdaptiveCard(adaptiveCards, attachment.content);

    return (
      <AdaptiveCardRenderer adaptiveCard={ card } />
    );
  }
}

AdaptiveCardAttachment.propTypes = {
  adaptiveCards: PropTypes.any,
  attachment: PropTypes.shape({
    content: PropTypes.any
  })
};
