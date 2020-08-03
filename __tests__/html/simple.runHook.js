/**
 * @jest-environment ./__tests__/html/__jest__/WebChatEnvironment.js
 */

describe('simple', () => {
  test('should render UI and run a hook.', () => runHTMLTest('simple.runHook.html'));
});
