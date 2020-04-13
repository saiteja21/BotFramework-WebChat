// We are trying our best effort to check for DOM tree integrity.
// When we extend this function, we should also consider using open source tools to verify.
export default function verifyDOMIntegrity() {
  // If an element has "aria-labelledby", the label element must be present on the screen.
  [].forEach.call(document.querySelectorAll('[aria-labelledby]'), element => {
    const labelIds = element.getAttribute('aria-labelledby');

    labelIds.split(',').forEach(labelId => {
      labelId = (labelId || '').trim();

      const labelElement = document.getElementById(labelId);

      if (!labelElement) {
        const message = `verifyDOMIntegrity: Cannot find element referenced by aria-labelledby attribute with ID "${labelId}".`;

        console.warn(message, element);

        throw new Error(message);
      }
    });
  });

  // No two elements can have the same ID.
  [].forEach.call(document.querySelectorAll('[id]'), element => {
    const id = element.getAttribute('id');
    const elementsWithId = document.querySelectorAll(`#${id}`);

    if (elementsWithId.length > 1) {
      const message = `Only one element can have ID "${id}", we saw ${elementsWithId.length} elements sharing same ID.`;

      console.warn(message, elementsWithId);

      throw new Error(message);
    }
  });

  // No class attribute should have the word "undefined" in it.
  [].forEach.call(document.querySelectorAll('[class]'), element => {
    const className = element.getAttribute('class');

    if (~className.indexOf('undefined')) {
      const message = `No elements should have the keyword "undefined" in it, we saw "${className}".`;

      console.warn(message, element);

      throw new Error(message);
    }
  });

  // role="log" must have accessible name.
  // https://www.w3.org/TR/wai-aria-practices-1.1/#naming_role_guidance
  // https://www.w3.org/TR/wai-aria-1.1/#log
  [].forEach.call(document.querySelectorAll('[role="log"]'), element => {
    if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
      const message = `Element with role="log" must have either aria-label or aria-labelledby`;

      console.warn(message, element);

      throw new Error(message);
    }
  });
}
