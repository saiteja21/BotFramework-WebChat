import { css } from 'glamor';
import React from 'react';

import { monospaceSmallFont } from '../../Styles';

const ROOT_CSS = css({
  ...monospaceSmallFont,
  margin: 0
});

export default props =>
  <pre className={ ROOT_CSS }>
    { props.children }
  </pre>