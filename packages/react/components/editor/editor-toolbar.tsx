'use client';

import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { cx } from 'class-variance-authority';
import { type ComponentProps, useEffect, useRef } from 'react';
import { Toolbar } from '../toolbar';
import { Tooltip } from '../tooltip';
import styles from './editor.module.css';
import { useEditorStore, useStoreSelector } from './editor-context';

export type EditorToolbarProps = ComponentProps<typeof Toolbar>;

/** Focuses the first control in a toolbar that can take focus. */
export function focusFirstControl(root: HTMLElement | null): boolean {
  const control = root?.querySelector<HTMLElement>(
    'button:not([disabled]):not([aria-disabled="true"]), input:not([disabled])'
  );
  if (!control) return false;
  control.focus();
  return true;
}

/** A toolbar that stays in place, above or below the content. */
export function EditorToolbar({
  className,
  ref,
  'aria-label': ariaLabel = 'Formatting',
  ...props
}: EditorToolbarProps) {
  const store = useEditorStore('Editor.Toolbar');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mergedRef = useMergedRefs(rootRef, ref);
  const readOnly = useStoreSelector(store, current => current.props.readOnly);
  const disabled = useStoreSelector(store, current => current.props.disabled);

  useEffect(
    () => store.registerToolbar(0, () => focusFirstControl(rootRef.current)),
    [store]
  );

  if (readOnly) return null;

  return (
    <Tooltip.Provider>
      <Toolbar
        data-slot='editor-toolbar'
        ref={mergedRef}
        aria-label={ariaLabel}
        className={cx(styles.toolbar, className)}
        disabled={disabled}
        {...props}
      />
    </Tooltip.Provider>
  );
}

EditorToolbar.displayName = 'Editor.Toolbar';
