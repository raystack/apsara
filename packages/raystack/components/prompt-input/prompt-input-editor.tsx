'use client';

import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { cx } from 'class-variance-authority';
import {
  type ComponentProps,
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import {
  deriveDocDetails,
  docFromMarkup,
  editorStyles,
  SuggestionMenu,
  type SuggestionState,
  useEditor
} from '../editor';
import styles from './prompt-input.module.css';
import {
  type PromptInputInputApi,
  usePromptInputContext
} from './prompt-input-context';
import { useMentionMenu, useMentionResolution } from './use-mention-menu';

export interface PromptInputEditorProps
  extends Omit<
    ComponentProps<'div'>,
    'contentEditable' | 'children' | 'dangerouslySetInnerHTML' | 'role'
  > {
  /**
   * Shown while the composer is empty.
   * @defaultValue "Write a message…"
   */
  placeholder?: string;
  /** Disables just the editor. Inherits the root `disabled` by default. */
  disabled?: boolean;
  /**
   * Cap on the derived plain text — a chip counts as its label. Enforced by a
   * transaction filter, so paste and IME are covered, not just keystrokes.
   */
  maxLength?: number;
  /**
   * Valid on a contentEditable, unlike `maxLength`.
   * @defaultValue true
   */
  spellCheck?: boolean;
}

/**
 * The ProseMirror sibling to `PromptInput.Textarea`: same outward contract —
 * Enter submits, Shift+Enter breaks, placeholder, auto-grow, `disabled`, frame
 * focus — on a contentEditable that can host inline mention chips.
 */
export function PromptInputEditor({
  className,
  placeholder = 'Write a message…',
  disabled,
  maxLength,
  spellCheck = true,
  ref,
  ...props
}: PromptInputEditorProps) {
  const context = usePromptInputContext('Editor');
  const listboxId = useId();
  const resolvedDisabled = disabled ?? context.disabled;

  const [suggestion, setSuggestion] = useState<SuggestionState | null>(null);
  const [frameWidth, setFrameWidth] = useState<number | undefined>(undefined);

  const setValueRef = useRef(context.setValue);
  setValueRef.current = context.setValue;
  const requestSubmitRef = useRef(context.requestSubmit);
  requestSubmitRef.current = context.requestSubmit;
  const registry = context.mentions;

  // Broken out of the option object so the menu, which needs `actions`, can
  // still supply the key handler the editor plugin calls.
  const keyDownRef = useRef<
    ((event: KeyboardEvent, state: SuggestionState) => boolean) | null
  >(null);

  const { hostRef, initialHtml, viewRef, mentionPortals, actions } = useEditor({
    initialMarkup: context.value,
    placeholder,
    disabled: resolvedDisabled,
    spellCheck,
    maxLength,
    getTriggers: () => registry.triggers(),
    onChange: details =>
      setValueRef.current(details.markup, {
        text: details.text,
        mentions: details.mentions
      }),
    onSubmit: () => requestSubmitRef.current(),
    onSuggestionChange: setSuggestion,
    onSuggestionKeyDown: (event, state) =>
      keyDownRef.current?.(event, state) ?? false
  });

  const menu = useMentionMenu({
    viewRef,
    actions,
    registry,
    suggestion,
    disabled: resolvedDisabled,
    listboxId
  });
  keyDownRef.current = menu.handleKeyDown;

  useMentionResolution(registry, context.details.mentions, actions);

  const api = useMemo<PromptInputInputApi>(
    () => ({
      focus: () => actions.focus(),
      setMarkup: markup => actions.setMarkup(markup),
      deriveExternal: markup => {
        const derived = deriveDocDetails(docFromMarkup(markup));
        return { text: derived.text, mentions: derived.mentions };
      },
      getMessage: () => {
        const details = actions.getDetails();
        return {
          markup: details.markup,
          text: details.text,
          mentions: details.mentions
        };
      },
      insertMention: (item, options) => {
        const trigger = options?.trigger ?? registry.triggers()[0] ?? '@';
        const type = item.type ?? 'mention';
        registry.remember(trigger, { ...item, type });
        actions.insertMention({
          id: item.id,
          label: item.label,
          type,
          trigger
        });
      }
    }),
    [actions, registry]
  );

  const registerInput = context.registerInput;
  const register = useCallback(
    (node: HTMLDivElement | null) => {
      hostRef(node);
      registerInput(node, api, 'editor');
    },
    [api, hostRef, registerInput]
  );

  const mergedRef = useMergedRefs(register, ref);

  // A caret is a zero-width anchor, so the menu cannot size itself from
  // `--anchor-width`; it takes the composer's width instead, re-measured as the
  // panel resizes. Deliberately a passive effect rather than a layout one: the
  // frame is this part's ancestor, and React attaches an ancestor's ref *after*
  // running a descendant's layout effects — measuring there would read a null
  // frame once and never look again.
  const frameRef = context.frameRef;
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      const width = frame.getBoundingClientRect().width;
      setFrameWidth(width > 0 ? width : undefined);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [frameRef]);

  const hasMentions = registry.triggers().length > 0;

  return (
    <>
      <div
        {...props}
        ref={mergedRef}
        className={cx(styles.editor, editorStyles.editor, className)}
        role='textbox'
        aria-multiline='true'
        aria-disabled={resolvedDisabled || undefined}
        aria-autocomplete={hasMentions ? 'list' : undefined}
        aria-expanded={hasMentions ? menu.open : undefined}
        aria-controls={hasMentions && menu.open ? listboxId : undefined}
        aria-activedescendant={menu.activeOptionId}
        data-disabled={resolvedDisabled || undefined}
        data-empty={context.empty || undefined}
        spellCheck={spellCheck}
        // ProseMirror takes this subtree over on mount. Until then it holds the
        // derived plain text of the value, so a restored draft is readable on
        // the first paint instead of popping in.
        suppressHydrationWarning
        dangerouslySetInnerHTML={initialHtml}
      />

      {mentionPortals.map(portal => {
        const item = registry.lookup(
          portal.attrs.trigger,
          portal.attrs.type,
          portal.attrs.id
        );
        return (
          <Fragment key={portal.id}>
            {item?.icon ? createPortal(item.icon, portal.iconTarget) : null}
            {item?.trailing
              ? createPortal(item.trailing, portal.trailingTarget)
              : null}
          </Fragment>
        );
      })}

      {hasMentions ? (
        <SuggestionMenu
          open={menu.open}
          anchor={menu.anchor}
          id={listboxId}
          groups={menu.groups}
          highlightedIndex={menu.highlightedIndex}
          onHighlightChange={menu.setHighlightedIndex}
          onSelect={menu.select}
          onOpenChange={next => {
            if (!next) menu.close();
          }}
          loading={menu.loading}
          loadingRowCount={menu.loadingRowCount}
          emptyMessage={menu.emptyMessage}
          width={frameWidth}
        />
      ) : null}
    </>
  );
}

PromptInputEditor.displayName = 'PromptInput.Editor';
