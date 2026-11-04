'use client';

import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { cx } from 'class-variance-authority';
import { type Node as PMNode, Slice } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import {
  type ComponentProps,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { EXTERNAL } from '../editor/core/base';
import { isEditorEmpty } from '../editor/core/serializers';
import { resolveShortcuts } from '../editor/core/shortcuts';
import { useMentionRegistryVersion } from '../editor/core/use-suggestion-menu';
import { EditorHost } from '../editor/editor-content';
import { MentionsMenu } from '../editor/editor-mentions';
import { EditorStore, type EditorStoreProps } from '../editor/editor-store';
import styles from './prompt-input.module.css';
import {
  type PromptInputInputApi,
  usePromptInputContext
} from './prompt-input-context';
import {
  deriveDocDetails,
  docFromMarkup,
  promptInputSchema
} from './prompt-input-markup';
import { promptInputPlugins } from './prompt-input-plugins';

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
   * Cap on the derived plain text, where a chip counts as its label. Enforced by a
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
 * Replaces the doc when `markup` differs from what it serializes to, so a
 * controlled `value` does not move the caret on every keystroke. The change is
 * not reported and is not an undo step.
 */
function setMarkup(store: EditorStore, markup: string) {
  const { doc } = store.state;
  if (deriveDocDetails(doc).markup === markup) return;
  const tr = store.state.tr.replace(
    0,
    doc.content.size,
    new Slice(docFromMarkup(markup).content, 0, 0)
  );
  tr.setSelection(Selection.atEnd(tr.doc))
    .setMeta(EXTERNAL, true)
    .setMeta('addToHistory', false);
  store.dispatch(tr);
}

/**
 * The `Editor` engine as a sibling to `PromptInput.Textarea`: Enter submits,
 * Shift+Enter breaks, with a placeholder, auto-grow, `disabled` and frame
 * focus, on a contentEditable that can hold mention chips.
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
  const registry = context.mentions;
  const resolvedDisabled = disabled ?? context.disabled;
  const [frameWidth, setFrameWidth] = useState<number | undefined>(undefined);

  const contextRef = useRef(context);
  contextRef.current = context;
  const maxLengthRef = useRef(maxLength);
  maxLengthRef.current = maxLength;

  const storeProps: EditorStoreProps = {
    placeholder,
    disabled: resolvedDisabled,
    readOnly: false,
    onChange: report
  };

  const [store] = useState(
    () =>
      new EditorStore({
        schema: promptInputSchema,
        doc: docFromMarkup(context.value),
        // A restored draft opens with the caret after it.
        selectAtEnd: true,
        shortcuts: resolveShortcuts(),
        props: storeProps,
        mentions: registry,
        extend: () => ({
          first: promptInputPlugins({
            onSubmit: () => contextRef.current.requestSubmit(),
            getMaxLength: () => maxLengthRef.current
          }),
          // Whitespace alone keeps the placeholder, as it keeps `data-empty`.
          showsPlaceholder: isEditorEmpty
        })
      })
  );

  function report(doc: PMNode) {
    const { markup, text, mentions } = deriveDocDetails(doc);
    contextRef.current.setValue(markup, { text, mentions });
  }

  useLayoutEffect(() => {
    store.updateProps(storeProps);
  });

  // The Editor applies labels from `resolveMentions` without reporting them.
  // PromptInput reports them, so `onValueChange` carries the fresh label.
  function refreshLabels(labels: Map<string, string>) {
    const before = store.state.doc;
    store.refreshMentionLabels(labels);
    if (store.state.doc !== before) report(store.state.doc);
  }

  const api = useMemo<PromptInputInputApi>(
    () => ({
      focus: () => store.focus(),
      setMarkup: markup => setMarkup(store, markup),
      deriveExternal: markup => {
        const { text, mentions } = deriveDocDetails(docFromMarkup(markup));
        return { text, mentions };
      },
      getMessage: () => deriveDocDetails(store.state.doc),
      insertMention: (item, options) => {
        const view = store.view;
        if (!view) return;
        const trigger = options?.trigger ?? registry.triggers()[0] ?? '@';
        const type = item.type ?? 'mention';
        registry.remember(trigger, { ...item, type });
        // Not focused: the chip goes at the end of the draft.
        const end = Selection.atEnd(store.state.doc).from;
        store.insertMentionAt(
          { id: item.id, label: item.label, type, trigger },
          view.hasFocus() ? undefined : { from: end, to: end }
        );
      }
    }),
    [store, registry]
  );

  const registerInput = context.registerInput;
  const register = useCallback(
    (node: HTMLDivElement | null) => registerInput(node, api, 'editor'),
    [api, registerInput]
  );
  const mergedRef = useMergedRefs(register, ref);

  // A caret is a zero-width anchor, so the menu cannot size itself from
  // `--anchor-width`; it takes the composer's width instead, re-measured as the
  // panel resizes. Deliberately a passive effect rather than a layout one: the
  // frame is this part's ancestor, and React attaches an ancestor's ref *after*
  // running a descendant's layout effects, and measuring there would read a null
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

  // `PromptInput.Mentions` only registers data, so the menus render here,
  // next to the doc their query lives in.
  useMentionRegistryVersion(registry);

  return (
    <>
      <EditorHost
        {...props}
        ref={mergedRef}
        store={store}
        className={cx(styles.editor, className)}
        spellCheck={spellCheck}
        data-disabled={resolvedDisabled || undefined}
        data-empty={context.empty || undefined}
      />
      {registry.triggers().map(trigger => (
        <MentionsMenu
          key={trigger}
          {...registry.get(trigger)}
          store={store}
          trigger={trigger}
          name='PromptInput.Mentions'
          width={frameWidth}
          refreshLabels={refreshLabels}
        />
      ))}
    </>
  );
}

PromptInputEditor.displayName = 'PromptInput.Editor';
