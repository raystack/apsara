'use client';

import { useControlled } from '@base-ui/utils/useControlled';
import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  FormEvent,
  MouseEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef
} from 'react';
import styles from './prompt-input.module.css';
import {
  PromptInputContext,
  type PromptInputContextValue,
  type PromptInputStatus
} from './prompt-input-context';

export interface PromptInputRootProps
  extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  /** The composed text (controlled). */
  value?: string;
  /**
   * The initial text when uncontrolled.
   * @defaultValue ""
   */
  defaultValue?: string;
  /** Called when the composed text changes. */
  onValueChange?: (value: string) => void;
  /**
   * Called with the trimmed text when the prompt is submitted — Enter in the
   * textarea or a click on `PromptInput.Submit`. Call
   * `event.currentTarget.reset()` to clear the input after sending.
   */
  onSubmit?: (value: string, event: FormEvent<HTMLFormElement>) => void;
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
   * `PromptInput.Textarea` registers itself here on mount; pass a ref of your
   * own when you render a custom input instead. Whichever is set first wins.
   */
  inputRef?: RefObject<HTMLElement | null>;
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
  children,
  ref,
  ...props
}: PromptInputRootProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const ownInputRef = useRef<HTMLElement | null>(null);
  const inputRef = inputRefProp ?? ownInputRef;

  const registerInput = useCallback(
    (node: HTMLElement | null) => {
      const current = inputRef.current;
      if (!node || current?.isConnected) return;
      inputRef.current = node;
    },
    [inputRef]
  );

  const [value, setValueUnwrapped] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: 'PromptInput',
    state: 'value'
  });

  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  const setValue = useCallback(
    (next: string) => {
      setValueUnwrapped(next);
      onValueChangeRef.current?.(next);
    },
    [setValueUnwrapped]
  );

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled || status === 'submitted' || status === 'streaming') return;
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed, event);
  };

  const handleReset = (event: FormEvent<HTMLFormElement>) => {
    onReset?.(event);
    if (event.defaultPrevented) return;
    setValue('');
  };

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
    inputRef.current?.focus();
  };

  const contextValue = useMemo<PromptInputContextValue>(
    () => ({
      value,
      setValue,
      status,
      disabled,
      onStop,
      inputRef,
      registerInput,
      requestSubmit
    }),
    [
      value,
      setValue,
      status,
      disabled,
      onStop,
      inputRef,
      registerInput,
      requestSubmit
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
        data-status={status}
        data-disabled={disabled || undefined}
        data-empty={value.trim() === '' || undefined}
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
