export default function AutoResizeTextArea({ primaryFont }) {
  return {
    '&.webchat__auto-resize-textarea': {
      fontFamily: primaryFont,
      position: 'relative',

      '& .webchat__auto-resize-textarea__doppelganger': {
        color: 'transparent',
        height: '100%',
        overflowY: 'auto',
        width: 'inherit',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      },

      '& .webchat__auto-resize-textarea__textarea': {
        appearance: 'none' /* We should tell the user agent we are revamping the style */,
        backgroundColor: 'transparent',
        border: 0,
        color: 'inherit',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        height: '100%',
        left: 0,
        margin: 0,
        outline: 0,
        padding: 0,
        position: 'absolute',
        resize: 'none' /* Hiding the textarea resizing handle (on lower-right hand corner) */,
        top: 0,
        width: '100%',
        wordBreak: 'break-word'
      }
    }
  };
}