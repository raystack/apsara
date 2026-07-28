'use client';

import { useControlled } from '@base-ui/utils/useControlled';
import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  FormEvent,
  MouseEvent,
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
}

/**
 * Targets that own the click: their own focus (or activation) must not be
 * hijacked by the frame's click-to-focus.
 */
const INTERACTIVE_TARGET =
  'button, a[href], input, textarea, select, label, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

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
  children,
  ref,
  ...props
}: PromptInputRootProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  // The whole frame reads as one field, so its dead space (padding, the
  // header/footer gaps) focuses the textarea. Handled on mousedown rather
  // than click so focus never leaves the textarea in the first place —
  // a blur/refocus round trip would close anything anchored to it.
  const handleMouseDown = (event: MouseEvent<HTMLFormElement>) => {
    onMouseDown?.(event);
    if (event.defaultPrevented || disabled) return;
    // Secondary buttons open the context menu / paste; leave them be.
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    // Controls (and the textarea itself) keep their native behaviour.
    if (target.closest(INTERACTIVE_TARGET)) return;
    const textarea = textareaRef.current;
    if (!textarea || textarea.disabled) return;
    // Suppresses the default focus shift to the frame, which would blur the
    // textarea and drop the caret.
    event.preventDefault();
    textarea.focus();
  };

  const contextValue = useMemo<PromptInputContextValue>(
    () => ({
      value,
      setValue,
      status,
      disabled,
      onStop,
      textareaRef,
      requestSubmit
    }),
    [value, setValue, status, disabled, onStop, requestSubmit]
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
