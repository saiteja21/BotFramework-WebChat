export default function createSendBoxStyle({
  sendBoxBackground,
  sendBoxHeight,
  sendBoxBorderBottom,
  sendBoxBorderLeft,
  sendBoxBorderRight,
  sendBoxBorderTop
}) {
  return {
    '&.webchat__basic-send-box': {
      '& .webchat__basic-send-box__main': {
        alignItems: 'stretch',
        backgroundColor: sendBoxBackground,
        borderBottom: sendBoxBorderBottom,
        borderLeft: sendBoxBorderLeft,
        borderRight: sendBoxBorderRight,
        borderTop: sendBoxBorderTop,
        minHeight: sendBoxHeight
      }
    }
  };
}
