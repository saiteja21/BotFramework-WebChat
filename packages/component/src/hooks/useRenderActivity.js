import useCreateActivityRendererInternal from './internal/useCreateActivityRendererInternal';

// In the old days, the useRenderActivity() will be called like this:
//
// const renderActivity = useRenderActivity();
// const element = renderActivity({ activity, nextVisibleActivity });

// In the new days, the useCreateActivityRenderer() is a 2-pass function:
//
// const createActivityRenderer = useCreateActivityRenderer();
// const renderActivity = createActivityRenderer({ activity, nextVisibleActivity });
// const element = renderActivity && renderActivity(undefined, { renderActivityStatus, renderAvatar, showCallout });

// Despite deprecation, useRenderActivity() can be retrofitted using useCreateActivityRenderer().

let showDeprecationNotes = true;

export default function useRenderActivity(renderAttachment) {
  if (showDeprecationNotes) {
    console.warn(
      'botframework-webchat: "useRenderActivity" is deprecated and will be removed on or after 2022-07-22. Please use "useCreateActivityRenderer()" instead.'
    );

    showDeprecationNotes = false;
  }

  if (typeof renderAttachment !== 'function') {
    throw new Error('botframework-webchat: First argument passed to "useRenderActivity" must be a function.');
  }

  const createActivityRenderer = useCreateActivityRendererInternal(renderAttachment);

  return useCallback(renderActivityArgs => {
    if (!renderActivityArgs || !renderActivityArgs.activity) {
      throw new Error(
        'botframework-webchat: First argument passed to the callback of useRenderActivity() must contains "activity" property.'
      );
    }

    const renderActivity = createActivityRenderer(renderActivityArgs);

    return (
      !!renderActivity ||
      renderActivity(renderAttachmentArgs =>
        renderAttachment({
          activity: renderActivityArgs.activity,
          ...renderAttachmentArgs
        })
      )
    );
  });
}
