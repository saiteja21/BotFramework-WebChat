import { Components, connectToWebChat } from 'botframework-webchat-component';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import React from 'react';

import { AdaptiveCardBuilder } from './AdaptiveCardBuilder';
import CommonCard from './CommonCard';

const { ImageContent, VideoContent } = Components;

class AnimationCardAttachment extends React.Component {
  constructor(props) {
    super(props);

    this.buildCard = memoize((adaptiveCards, content) => {
      const builder = new AdaptiveCardBuilder(adaptiveCards);

      (content.images || []).forEach(image => builder.addImage(image.url, null, image.tap));

      builder.addCommon(content);

      return builder.card;
    });
  }

  render() {
    const { props: { adaptiveCards, attachment, styleSet } } = this;
    const { content = {} } = attachment || {};

    return (
      <div className={ styleSet.animationCardAttachment }>
        <ul className="media-list">
          {
            content.media.map((media, index) =>
              <li key={ index }>
                {
                  /\.gif$/i.test(media.url) ?
                    <ImageContent
                      alt={ media.profile }
                      src={ media.url }
                    />
                  :
                    <VideoContent
                      alt={ media.profile }
                      src={ media.url }
                    />
                }
              </li>
            )
          }
        </ul>
        <CommonCard
          adaptiveCards={ adaptiveCards }
          attachment={ attachment }
        />
      </div>
    );
  }
}

AnimationCardAttachment.propTypes = {
  adaptiveCards: PropTypes.any,
  attachment: PropTypes.shape({
    content: PropTypes.any
  }),
  styleSet: PropTypes.any
};

export default connectToWebChat(
  ({ styleSet }) => ({ styleSet })
)(AnimationCardAttachment)
