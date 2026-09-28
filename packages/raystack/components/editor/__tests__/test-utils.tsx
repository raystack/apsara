import { act, fireEvent } from '@testing-library/react';
import { TextSelection } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import { getSlot } from '~/test-utils/data-slots';
import type { EditorJSON } from '../core/json';

export function contentOf(container: ParentNode): HTMLElement {
  const node = getSlot(container, 'editor-content');
  if (!node) throw new Error('editor content not found');
  return node;
}

/**
 * Stands in for typing. A paste is the only synthetic text entry that reaches
 * a contentEditable ProseMirror view in jsdom.
 */
export function paste(element: HTMLElement, text: string) {
  fireEvent.paste(element, {
    clipboardData: {
      types: ['text/plain'],
      files: [],
      getData: (kind: string) => (kind === 'text/plain' ? text : '')
    }
  });
}

/** Fires a copy and returns what the editor wrote to `text/plain`. */
export function copy(element: HTMLElement): string {
  const data: Record<string, string> = {};
  fireEvent.copy(element, {
    clipboardData: {
      clearData: () => undefined,
      setData: (kind: string, value: string) => {
        data[kind] = value;
      }
    }
  });
  return data['text/plain'] ?? '';
}

/** Types through ProseMirror's text input path, so input rules run. */
export function typeText(view: EditorView, text: string) {
  for (const char of text) {
    act(() => {
      const { from, to } = view.state.selection;
      const handled = view.someProp('handleTextInput', handler =>
        handler(view, from, to, char, () =>
          view.state.tr.insertText(char, from, to)
        )
      );
      if (!handled) view.dispatch(view.state.tr.insertText(char, from, to));
    });
  }
}

export function select(view: EditorView, from: number, to: number) {
  act(() => {
    view.dispatch(
      view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to))
    );
  });
}

export function pressKey(
  element: HTMLElement,
  key: string,
  init: KeyboardEventInit = {}
) {
  fireEvent.keyDown(element, { key, ...init });
}

export const flush = async () => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
};

export function doc(...content: EditorJSON[]): EditorJSON {
  return { type: 'doc', content };
}

export function p(...content: Array<EditorJSON | string>): EditorJSON {
  return {
    type: 'paragraph',
    content: content.length
      ? content.map(child =>
          typeof child === 'string' ? { type: 'text', text: child } : child
        )
      : undefined
  };
}
