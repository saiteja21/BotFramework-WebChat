import { hooks } from 'botframework-webchat-api';
import React from 'react';

import SuggestedActions from './SendBox/SuggestedActions';

const { useSuggestedActions } = hooks;

const BasicSuggestedActions = () => {
  const [suggestedActions] = useSuggestedActions();

  return <SuggestedActions suggestedActions={suggestedActions} />;
};

export default BasicSuggestedActions;
