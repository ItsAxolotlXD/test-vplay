/**
 * Utility functions for V-board virtual keyboard
 * Handles React native value setter dispatch, caret manipulation,
 * and preventing device on-screen keyboards.
 */

import { processTelexWord } from './telexEngine';

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  'value'
)?.set;

const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLTextAreaElement.prototype,
  'value'
)?.set;

/**
 * Updates an input or textarea element's value while correctly triggering
 * React's synthetic onChange and native events.
 */
export function updateInputElementValue(
  element: HTMLInputElement | HTMLTextAreaElement,
  newValue: string,
  newCursorPos?: number
) {
  const isTextArea = element instanceof HTMLTextAreaElement;
  const setter = isTextArea ? nativeTextAreaValueSetter : nativeInputValueSetter;

  if (setter) {
    setter.call(element, newValue);
  } else {
    element.value = newValue;
  }

  // Dispatch both input and change events for complete React & DOM compatibility
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));

  // Restore or advance cursor selection
  if (typeof newCursorPos === 'number') {
    try {
      element.setSelectionRange(newCursorPos, newCursorPos);
    } catch {}
  }
}

/**
 * Inserts text at the current cursor or replaces selection in the target element,
 * with Vietnamese Telex typing engine support.
 */
export function insertTextIntoElement(
  element: HTMLInputElement | HTMLTextAreaElement,
  textToInsert: string,
  useTelex: boolean = true
) {
  const start = element.selectionStart ?? element.value.length;
  const end = element.selectionEnd ?? element.value.length;
  const currentVal = element.value;

  // Apply Vietnamese Telex if enabled and single letter key
  if (useTelex && textToInsert.length === 1 && /[A-Za-z]/.test(textToInsert)) {
    const beforeCursor = currentVal.slice(0, start);
    // Find the current Vietnamese word token before cursor
    const match = beforeCursor.match(/([A-Za-z0-9àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ]+)$/);

    if (match) {
      const currentWord = match[1];
      const wordStartIndex = start - currentWord.length;
      const { newWord, handled } = processTelexWord(currentWord, textToInsert);

      if (handled) {
        const nextVal = currentVal.slice(0, wordStartIndex) + newWord + currentVal.slice(end);
        const nextPos = wordStartIndex + newWord.length;
        updateInputElementValue(element, nextVal, nextPos);
        return;
      }
    } else {
      // At start of word or empty word
      const { newWord, handled } = processTelexWord('', textToInsert);
      if (handled) {
        const nextVal = currentVal.slice(0, start) + newWord + currentVal.slice(end);
        const nextPos = start + newWord.length;
        updateInputElementValue(element, nextVal, nextPos);
        return;
      }
    }
  }

  // Default insertion
  const nextVal = currentVal.slice(0, start) + textToInsert + currentVal.slice(end);
  const nextPos = start + textToInsert.length;

  updateInputElementValue(element, nextVal, nextPos);
}

/**
 * Handles backspace deletion at current cursor or deletes selection
 */
export function deleteCharacterFromElement(
  element: HTMLInputElement | HTMLTextAreaElement
) {
  const start = element.selectionStart ?? element.value.length;
  const end = element.selectionEnd ?? element.value.length;
  const currentVal = element.value;

  if (start === 0 && end === 0) return;

  let nextVal: string;
  let nextPos: number;

  if (start !== end) {
    // Delete selection
    nextVal = currentVal.slice(0, start) + currentVal.slice(end);
    nextPos = start;
  } else {
    // Delete one character before cursor
    nextVal = currentVal.slice(0, start - 1) + currentVal.slice(start);
    nextPos = Math.max(0, start - 1);
  }

  updateInputElementValue(element, nextVal, nextPos);
}

/**
 * Dispatches Enter / Search events and submits enclosing form if present
 */
export function triggerSearchOrSubmit(
  element: HTMLInputElement | HTMLTextAreaElement
) {
  // 1. Dispatch Enter keydown and keyup events
  const enterDown = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(enterDown);

  const enterUp = new KeyboardEvent('keyup', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    bubbles: true,
  });
  element.dispatchEvent(enterUp);

  // 2. Submit form if element is enclosed in a form
  const form = element.closest('form');
  if (form) {
    try {
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    } catch (e) {
      console.warn('V-board form submit error:', e);
    }
  }
}

/**
 * Applies inputmode="none" to prevent native mobile/device keyboard from opening
 */
export function disableDeviceKeyboard(element: HTMLElement) {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    if (element.getAttribute('inputmode') !== 'none') {
      element.setAttribute('inputmode', 'none');
    }
  }
}

/**
 * Restores default inputmode
 */
export function restoreDeviceKeyboard(element: HTMLElement) {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    element.removeAttribute('inputmode');
  }
}
