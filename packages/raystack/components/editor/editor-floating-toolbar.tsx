'use client';

import { cx } from 'class-variance-authority';
import {
  AllSelection,
  type EditorState,
  TextSelection
} from 'prosemirror-state';
import {
  type ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Popover } from '../popover';
import { Toolbar } from '../toolbar';
import { Tooltip } from '../tooltip';
import styles from './editor.module.css';
import { useEditorStore, useStoreSelector } from './editor-context';
import {
  FloatingToolbarContext,
  type FloatingToolbarContextValue
} from './editor-floating-context';
import { EditorLinkForm } from './editor-link-form';
import { focusFirstControl } from './editor-toolbar';

export interface EditorFloatingToolbarProps
  extends Omit<ComponentProps<typeof Toolbar>, 'orientation'> {
  /**
   * The side of the selection the toolbar shows on.
   * @default 'top'
   */
  side?: 'top' | 'bottom';
  /**
   * How the toolbar aligns to the selection.
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Distance from the selection in pixels.
   * @default 8
   */
  sideOffset?: number;
  /** Decides whether the toolbar shows for a state. Replaces the default rule. */
  shouldShow?: (state: EditorState) => boolean;
}

/** A non-empty text selection outside a code block. */
function defaultShouldShow(state: EditorState): boolean {
  const { selection } = state;
  if (
    !(selection instanceof TextSelection || selection instanceof AllSelection)
  ) {
    return false;
  }
  if (selection.empty) return false;
  if (selection.$from.parent.type.spec.code) return false;
  if (selection.$to.parent.type.spec.code) return false;
  return (
    state.doc.textBetween(selection.from, selection.to, ' ', ' ').trim()
      .length > 0
  );
}

/** A toolbar that shows above a text selection. */
export function EditorFloatingToolbar({
  side = 'top',
  align = 'start',
  sideOffset = 8,
  shouldShow,
  className,
  children,
  'aria-label': ariaLabel = 'Formatting',
  ...props
}: EditorFloatingToolbarProps) {
  const store = useEditorStore('Editor.FloatingToolbar');
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<'buttons' | 'link'>('buttons');
  const [holds, setHolds] = useState(0);
  const [focusWithin, setFocusWithin] = useState(false);
  const [dismissedAt, setDismissedAt] = useState<string | null>(null);

  const selectionKey = useStoreSelector(
    store,
    current => `${current.state.selection.from}:${current.state.selection.to}`
  );
  const readOnly = useStoreSelector(store, current => current.props.readOnly);
  const eligible = useStoreSelector(
    store,
    current =>
      current.isEditable() &&
      !current.pointerSelecting &&
      current.view !== null &&
      (shouldShow ?? defaultShouldShow)(current.state)
  );
  const focused = useStoreSelector(store, current => current.focused);

  const visible =
    eligible &&
    (focused || focusWithin || holds > 0 || mode === 'link') &&
    dismissedAt !== selectionKey;

  useEffect(() => {
    if (!eligible) setMode('buttons');
  }, [eligible]);

  const visibleRef = useRef(visible);
  visibleRef.current = visible;
  useEffect(
    () =>
      store.registerToolbar(
        1,
        () => visibleRef.current && focusFirstControl(popupRef.current)
      ),
    [store]
  );

  const hold = useCallback(() => {
    setHolds(count => count + 1);
    return () => setHolds(count => count - 1);
  }, []);

  const context = useMemo<FloatingToolbarContextValue>(
    () => ({
      visible,
      openLink: () => setMode('link'),
      closeLink: () => setMode('buttons'),
      hold
    }),
    [visible, hold]
  );

  const lastRectRef = useRef<DOMRect | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new anchor on every selection change makes the positioner measure again
  const anchor = useMemo(
    () => ({
      get contextElement() {
        return store.view?.dom;
      },
      getBoundingClientRect: () => {
        const view = store.view;
        if (view) {
          const { from, to } = view.state.selection;
          try {
            const start = view.coordsAtPos(from);
            const end = view.coordsAtPos(to);
            const left = Math.min(start.left, end.left);
            const top = Math.min(start.top, end.top);
            const rect = new DOMRect(
              left,
              top,
              Math.max(start.right, end.right) - left,
              Math.max(start.bottom, end.bottom) - top
            );
            lastRectRef.current = rect;
            return rect;
          } catch {
            // The selection is gone, or the browser is mid-relayout.
          }
        }
        return lastRectRef.current ?? new DOMRect(0, 0, 0, 0);
      }
    }),
    [store, selectionKey]
  );

  if (readOnly) return null;

  return (
    <FloatingToolbarContext value={context}>
      <Popover
        open={visible}
        onOpenChange={(open, details) => {
          if (open || details.reason !== 'escape-key') return;
          setDismissedAt(selectionKey);
          setMode('buttons');
          store.view?.focus();
        }}
      >
        <Popover.Content
          ref={popupRef}
          anchor={anchor}
          side={side}
          align={align}
          sideOffset={sideOffset}
          initialFocus={false}
          finalFocus={false}
          className={styles['floating-popup']}
          onFocus={() => setFocusWithin(true)}
          onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setFocusWithin(false);
            }
          }}
        >
          {mode === 'link' ? (
            <EditorLinkForm onDone={() => setMode('buttons')} />
          ) : (
            <Tooltip.Provider>
              <Toolbar
                data-slot='editor-floating-toolbar'
                aria-label={ariaLabel}
                className={cx(styles['floating-toolbar'], className)}
                {...props}
              >
                {children}
              </Toolbar>
            </Tooltip.Provider>
          )}
        </Popover.Content>
      </Popover>
    </FloatingToolbarContext>
  );
}

EditorFloatingToolbar.displayName = 'Editor.FloatingToolbar';
