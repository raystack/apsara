'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import {
  type RefObject,
  useImperativeHandle,
  useLayoutEffect,
  useState
} from 'react';
import type { EditorJSON } from './core/json';
import { buildSchema, type EditorFormat } from './core/schema';
import { isEditorEmpty } from './core/serializers';
import { type EditorShortcuts, resolveShortcuts } from './core/shortcuts';
import styles from './editor.module.css';
import { EditorContext, useStoreSelector } from './editor-context';
import { EditorStore } from './editor-store';
import type {
  EditorApi,
  EditorChangeDetails,
  EditorMarkdownChangeDetails,
  MarkdownAdapter
} from './editor-types';

interface EditorBaseProps
  extends Omit<
    useRender.ComponentProps<'div'>,
    'defaultValue' | 'onChange' | 'placeholder' | 'autoFocus'
  > {
  /** Shows while the doc is empty. */
  placeholder?: string;
  /**
   * Allowlist of nodes and marks. Read once, when the editor is created.
   * @default all formats
   */
  formats?: EditorFormat[];
  /** Overrides a default key, or turns it off with `false`. Read once. */
  shortcuts?: EditorShortcuts;
  /**
   * Makes the editor not editable and disables the toolbars.
   * @default false
   */
  disabled?: boolean;
  /**
   * Makes the editor not editable and hides the toolbars and menus.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Focuses the editor on mount, with the caret at the start or the end.
   * @default false
   */
  autoFocus?: boolean | 'start' | 'end';
  /** Imperative handle with commands and serializers. */
  actionsRef?: RefObject<EditorApi | null>;
}

interface EditorJSONProps {
  markdown?: undefined;
  /** Controlled document. */
  value?: EditorJSON;
  /** The first document when uncontrolled. Read once. */
  defaultValue?: EditorJSON;
  /** Fires once per doc change. It does not fire for changes made through `value`. */
  onValueChange?: (value: EditorJSON, details: EditorChangeDetails) => void;
}

interface EditorMarkdownProps {
  /** Allows Markdown strings in `value` and `defaultValue`, and parses Markdown on paste. */
  markdown: MarkdownAdapter;
  /** Controlled document. A string is parsed as Markdown. */
  value?: EditorJSON | string;
  /** The first document when uncontrolled. A string is parsed as Markdown. */
  defaultValue?: EditorJSON | string;
  onValueChange?: (
    value: EditorJSON,
    details: EditorMarkdownChangeDetails
  ) => void;
}

export type EditorProps = EditorBaseProps &
  (EditorJSONProps | EditorMarkdownProps);

export function EditorRoot({
  value,
  defaultValue,
  onValueChange,
  markdown,
  placeholder,
  formats,
  shortcuts,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  actionsRef,
  className,
  render,
  ref,
  children,
  ...props
}: EditorProps) {
  const storeProps = {
    placeholder,
    disabled,
    readOnly,
    markdown,
    onValueChange: onValueChange as EditorStore['props']['onValueChange']
  };

  const [store] = useState(
    () =>
      new EditorStore({
        schema: buildSchema(formats),
        value: value ?? defaultValue,
        shortcuts: resolveShortcuts(shortcuts),
        props: storeProps,
        autoFocus
      })
  );

  // Runs after every render, so callbacks stay current and flag changes reach
  // the view before the next event.
  useLayoutEffect(() => {
    store.updateProps(storeProps);
  });

  useLayoutEffect(() => {
    if (value !== undefined) store.reconcile(value);
  }, [store, value]);

  useImperativeHandle(actionsRef, () => store.api, [store]);

  const focused = useStoreSelector(store, current => current.focused);
  const empty = useStoreSelector(store, current =>
    isEditorEmpty(current.state.doc)
  );

  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        'data-slot': 'editor',
        className: cx(styles.root, className),
        children,
        'data-focused': focused ? '' : undefined,
        'data-empty': empty ? '' : undefined,
        'data-disabled': disabled ? '' : undefined,
        'data-readonly': readOnly ? '' : undefined
      } as useRender.ElementProps<'div'>,
      props
    )
  });

  return <EditorContext value={store}>{element}</EditorContext>;
}

EditorRoot.displayName = 'Editor';
