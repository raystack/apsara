'use client';

import { useControlled } from '@base-ui/utils/useControlled';
import { cx } from 'class-variance-authority';
import { ComponentProps, FormEvent, useCallback, useMemo, useRef } from 'react';
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

export function PromptInputRoot({
  className,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onSubmit,
  onStop,
  onReset,
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
        {...props}
      >
        {children}
      </form>
    </PromptInputContext.Provider>
  );
}

PromptInputRoot.displayName = 'PromptInput';
