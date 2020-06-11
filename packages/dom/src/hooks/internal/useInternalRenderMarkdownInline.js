import useWebChatDOMContext from './useWebChatDOMContext';

function useInternalRenderMarkdownInline() {
  const { internalRenderMarkdownInline } = useWebChatDOMContext();

  return internalRenderMarkdownInline;
}

export default useInternalRenderMarkdownInline;
