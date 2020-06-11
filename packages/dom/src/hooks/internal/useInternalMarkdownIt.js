import useWebChatDOMContext from './useWebChatDOMContext';

function useInternalMarkdownIt() {
  return useWebChatDOMContext().internalMarkdownItState;
}

export default useInternalMarkdownIt;
