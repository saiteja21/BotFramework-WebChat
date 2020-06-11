import useWebChatDOMContext from './internal/useWebChatDOMContext';

export default function useStyleSet() {
  return [useWebChatDOMContext().styleSet];
}
