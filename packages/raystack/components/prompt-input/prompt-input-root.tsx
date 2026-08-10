'use client';

import { useControlled } from '@base-ui/utils/useControlled';
import { cx } from 'class-variance-authority';
import {
  type ComponentProps,
  type FormEvent,
  type MouseEvent,
  type RefObject,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
// Imported from the leaf module, not the barrel: the root must not pull the
// editor engine into a composer that only ever renders `Textarea`.
import { trimDetails } from '../editor/mention';
import styles from './prompt-input.module.css';
import {
  isEmptyValue,
  PromptInputContext,
  type PromptInputContextValue,
  type PromptInputInputApi,
  type PromptInputMention,
  type PromptInputMessage,
  type PromptInputPartKind,
  type PromptInputStatus,
  type PromptInputValueDetails
} from './prompt-input-context';
import {
  type PromptInputMentionItem,
  PromptInputMentionRegistry
} from './prompt-input-mention-registry';

export interface PromptInputActions {
  /** Focuses the input, dropping the caret at the end of the draft. */
  focus: () => void;
  /** Clears the composer. */
  clear: () => void;
  /**
   * Inserts a chip at the caret, or at the end of the draft when the editor is
   * not focused, followed by a trailing space. Requires `PromptInput.Editor`.
   */
  insertMention: (
    item: PromptInputMentionItem,
    options?: { trigger?: string }
  ) => void;
  /** The current value, untrimmed. */
  getValue: () => PromptInputMessage;
}

export interface PromptInputRootProps
  extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  /**
   * Controlled markup string — the same dialect `onValueChange` reports and
   * `PromptInput.Editor` parses. Most consumers should stay uncontrolled.
   */
  value?: string;
  /**
   * The initial markup when uncontrolled.
   * @defaultValue ""
   */
  defaultValue?: string;
  /**
   * Called on every change. The first argument round-trips into `value`
   * losslessly, chips included.
   */
  onValueChange?: (
    markup: string,
    details: { text: string; mentions: PromptInputMention[] }
  ) => void;
  /**
   * Called with the trimmed message when the prompt is submitted — Enter in the
   * input or a click on `PromptInput.Submit`. Call
   * `event.currentTarget.reset()` to clear the composer after sending.
   */
  onSubmit?: (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>
  ) => void;
  /**
   * Called when `PromptInput.Submit` is pressed while `status` is
   * `"submitted"` or `"streaming"`.
   */
  onStop?: () => void;
  /**
   * The consumer-owned request lifecycle. Drives `PromptInput.Submit`:
   * `"idle"`/`"error"` show a send arrow, `"submitted"` a spinner and
   * `"streaming"` a stop square (both routed to `onStop`).
   * @defaultValue "idle"
   */
  status?: PromptInputStatus;
  /**
   * Disables the whole composer.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * The element the frame focuses when its own padding is clicked.
   * `PromptInput.Textarea` and `PromptInput.Editor` register themselves here on
   * mount; pass a ref of your own when you render a custom input instead.
   * Whichever is set first wins.
   */
  inputRef?: RefObject<HTMLElement | null>;
  /** Imperative handle. `ref` remains the `<form>` element. */
  actionsRef?: RefObject<PromptInputActions | null>;
}

const EMPTY_DETAILS: PromptInputValueDetails = { text: '', mentions: [] };

/**
 * Stand-in until a part registers, and the whole story for a plain string: no
 * markup is interpreted, so a literal `@[x](y:z)` stays literal.
 */
function literalDetails(markup: string): PromptInputValueDetails {
  return markup === '' ? EMPTY_DETAILS : { text: markup, mentions: [] };
}

function sameDetails(
  a: PromptInputValueDetails,
  b: PromptInputValueDetails
): boolean {
  if (a === b) return true;
  if (a.text !== b.text || a.mentions.length !== b.mentions.length) {
    return false;
  }
  return a.mentions.every((mention, index) => {
    const other = b.mentions[index];
    return (
      mention.id === other.id &&
      mention.type === other.type &&
      mention.trigger === other.trigger &&
      mention.start === other.start
    );
  });
}

export function PromptInputRoot({
  className,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onSubmit,
  onStop,
  onReset,
  onMouseDown,
  status = 'idle',
  disabled = false,
  inputRef: inputRefProp,
  actionsRef,
  children,
  ref,
  ...props
}: PromptInputRootProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const ownInputRef = useRef<HTMLElement | null>(null);
  const inputRef = inputRefProp ?? ownInputRef;
  const apiRef = useRef<PromptInputInputApi | null>(null);
  const partKindRef = useRef<PromptInputPartKind | null>(null);
  const [editorMounted, setEditorMounted] = useState(false);

  const mentions = useMemo(() => new PromptInputMentionRegistry(), []);

  const registerInput = useCallback(
    (
      node: HTMLElement | null,
      api?: PromptInputInputApi,
      kind?: PromptInputPartKind
    ) => {
      // The part that holds the slot is unmounting: hand it back, so a
      // replacement can take it, `getMessage` never reads off a destroyed
      // view, and swapping parts is not mistaken for mounting both. Guarded on
      // identity, so a consumer-supplied `inputRef` that won the race is left
      // alone.
      if (!node) {
        if (api && apiRef.current === api) {
          apiRef.current = null;
          partKindRef.current = null;
          inputRef.current = null;
          setEditorMounted(false);
        }
        return;
      }

      if (
        process.env.NODE_ENV !== 'production' &&
        kind &&
        partKindRef.current &&
        partKindRef.current !== kind
      ) {
        console.warn(
          '[Apsara] PromptInput.Textarea and PromptInput.Editor are mutually ' +
            'exclusive; the first to mount wins. Render one input part.'
        );
      }

      const current = inputRef.current;
      if (current && current.isConnected) return;

      inputRef.current = node;
      if (api) apiRef.current = api;
      if (kind) {
        partKindRef.current = kind;
        setEditorMounted(kind === 'editor');
      }
    },
    [inputRef]
  );

  const [value, setValueUnwrapped] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: 'PromptInput',
    state: 'value'
  });

  const [details, setDetails] = useState<PromptInputValueDetails>(() =>
    literalDetails(value)
  );
  /** The last markup the mounted part reported, so echoes are not re-applied. */
  const reportedRef = useRef<string | null>(null);

  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  /** Fills in `data`, which never survives serialization. */
  const withData = useCallback(
    (list: PromptInputMention[]): PromptInputMention[] =>
      list.map(mention => {
        const item = mentions.lookup(mention.trigger, mention.type, mention.id);
        return item && 'data' in item
          ? { ...mention, data: item.data }
          : mention;
      }),
    [mentions]
  );

  const setValue = useCallback(
    (markup: string, next: PromptInputValueDetails) => {
      const enriched = { text: next.text, mentions: withData(next.mentions) };
      reportedRef.current = markup;
      setValueUnwrapped(markup);
      setDetails(current =>
        sameDetails(current, enriched) ? current : enriched
      );
      onValueChangeRef.current?.(markup, enriched);
    },
    [setValueUnwrapped, withData]
  );

  /** A value Root itself pushed — a form reset, or `actionsRef.clear()`. */
  const applyValue = useCallback(
    (markup: string) => {
      const derived =
        apiRef.current?.deriveExternal(markup) ?? literalDetails(markup);
      const enriched = {
        text: derived.text,
        mentions: withData(derived.mentions)
      };
      reportedRef.current = markup;
      setValueUnwrapped(markup);
      setDetails(current =>
        sameDetails(current, enriched) ? current : enriched
      );
      apiRef.current?.setMarkup(markup);
      onValueChangeRef.current?.(markup, enriched);
    },
    [setValueUnwrapped, withData]
  );

  // Reconciles a value that did not come from the part: a controlled prop the
  // consumer changed, or a controlled prop they did *not* change after a
  // keystroke — in which case the part is asked to revert, which is what
  // `Textarea` has always done by rendering `value` straight through. Runs after
  // every render, because a controlled prop that stays put still needs it.
  useLayoutEffect(() => {
    if (reportedRef.current === value) return;
    reportedRef.current = value;
    const derived =
      apiRef.current?.deriveExternal(value) ?? literalDetails(value);
    const enriched = {
      text: derived.text,
      mentions: withData(derived.mentions)
    };
    setDetails(current =>
      sameDetails(current, enriched) ? current : enriched
    );
    apiRef.current?.setMarkup(value);
  });

  const requestSubmit = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    if (typeof form.requestSubmit === 'function') {
      form.requestSubmit();
    } else {
      form.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }
  }, []);

  /** Live, so a submit in the same tick as a keystroke is never a render behind. */
  const readMessage = useCallback((): PromptInputMessage => {
    const message = apiRef.current?.getMessage() ?? {
      markup: value,
      ...literalDetails(value)
    };
    return { ...message, mentions: withData(message.mentions) };
  }, [value, withData]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled || status === 'submitted' || status === 'streaming') return;
    const message = readMessage();
    if (isEmptyValue(message)) return;
    onSubmit?.(trimDetails(message), event);
  };

  const handleReset = (event: FormEvent<HTMLFormElement>) => {
    onReset?.(event);
    if (event.defaultPrevented) return;
    applyValue('');
  };

  const focusInput = useCallback(() => {
    if (apiRef.current) apiRef.current.focus();
    else inputRef.current?.focus();
  }, [inputRef]);

  // The frame reads as one field, so a press on its own layout focuses the
  // input. The header and footer are out of hit testing (see the stylesheet),
  // so a press on their padding lands on the form itself while their contents
  // keep their own. Handled on mousedown so focus never leaves the input and
  // back again — that round trip would dismiss anything anchored to it.
  const handleMouseDown = (event: MouseEvent<HTMLFormElement>) => {
    onMouseDown?.(event);
    if (event.defaultPrevented || disabled || event.button !== 0) return;
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    focusInput();
  };

  useImperativeHandle(
    actionsRef,
    () => ({
      focus: focusInput,
      clear: () => applyValue(''),
      insertMention: (item, options) => {
        if (!apiRef.current?.insertMention) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              '[Apsara] PromptInput actions.insertMention requires ' +
                '<PromptInput.Editor>; a native textarea cannot host chips.'
            );
          }
          return;
        }
        apiRef.current.insertMention(item, options);
      },
      getValue: readMessage
    }),
    [applyValue, focusInput, readMessage]
  );

  const empty = isEmptyValue(details);

  const contextValue = useMemo<PromptInputContextValue>(
    () => ({
      value,
      details,
      empty,
      setValue,
      status,
      disabled,
      onStop,
      inputRef,
      frameRef: formRef,
      registerInput,
      requestSubmit,
      mentions,
      editorMounted
    }),
    [
      value,
      details,
      empty,
      setValue,
      status,
      disabled,
      onStop,
      inputRef,
      registerInput,
      requestSubmit,
      mentions,
      editorMounted
    ]
  );

  return (
    <PromptInputContext.Provider value={contextValue}>
      <form
        ref={node => {
          formRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cx(styles.root, className)}
        data-slot='prompt-input'
        data-status={status}
        data-disabled={disabled || undefined}
        data-empty={empty || undefined}
        onSubmit={handleSubmit}
        onReset={handleReset}
        onMouseDown={handleMouseDown}
        {...props}
      >
        {children}
      </form>
    </PromptInputContext.Provider>
  );
}

PromptInputRoot.displayName = 'PromptInput';
