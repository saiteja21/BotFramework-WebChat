import useWebChatUIContext from './internal/useWebChatUIContext';

export default function useStyleOptions() {
  const { styleOptionsState } = useWebChatUIContext();

  return styleOptionsState;
}
