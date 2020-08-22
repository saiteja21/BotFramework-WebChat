import useWebChatUIContext from './useWebChatUIContext';

export default function useStyleToClassName() {
  const { styleToClassName } = useWebChatUIContext();

  return styleToClassName;
}
