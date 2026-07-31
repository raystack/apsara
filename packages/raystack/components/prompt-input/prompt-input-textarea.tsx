'use client';

import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { cx } from 'class-variance-authority';
import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useMemo,
  useRef
} from 'react';
import { TextArea, type TextAreaProps } from '../text-area/text-area';
import styles from './prompt-input.module.css';
import {
  type PromptInputInputApi,
  usePromptInputContext
} from './prompt-input-context';

export interface PromptInputTextareaProps
  extends Omit<
    TextAreaProps,
    'value' | 'defaultValue' | 'onValueChange' | 'variant' | 'size' | 'rows'
  > {}

export function PromptInputTextarea({
  className,
  onChange,
  onKeyDown,
  disabled,
  placeholder = 'Write a message…',
  ref,
  ...props
}: PromptInputTextareaProps) {
  const context = usePromptInputContext('Textarea');
  const nodeRef = useRef<HTMLTextAreaElement | null>(null);
  const valueRef = useRef(context.value);
  valueRef.current = context.value;

  // A plain textarea reports the same shape `Editor` does, so Root's callbacks
  // have one signature either way: markup *is* text and there are never any
  // mentions — a literal `@[x](y:z)` typed in here stays literal.
  const api = useMemo<PromptInputInputApi>(
    () => ({
      focus: () => nodeRef.current?.focus(),
      // The field renders Root's `value` straight through, so an external value
      // has already landed by the time this would run.
      setMarkup: () => undefined,
      deriveExternal: markup => ({ text: markup, mentions: [] }),
      getMessage: () => {
        const text = nodeRef.current?.value ?? valueRef.current;
        return { markup: text, text, mentions: [] };
      }
    }),
    []
  );

  const registerInput = context.registerInput;
  const register = useCallback(
    (node: HTMLTextAreaElement | null) => {
      nodeRef.current = node;
      registerInput(node, api, 'textarea');
    },
    [api, registerInput]
  );

  const mergedRef = useMergedRefs(register, ref);

  const resolvedDisabled = disabled ?? context.disabled;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event);
    const next = event.target.value;
    context.setValue(next, { text: next, mentions: [] });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key !== 'Enter' || event.shiftKey) return;
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    event.preventDefault();
    context.requestSubmit();
  };

  return (
    <TextArea
      ref={mergedRef}
      rows={1}
      variant='borderless'
      size='small'
      className={cx(styles.textarea, className)}
      value={context.value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={resolvedDisabled}
      placeholder={placeholder}
      {...props}
    />
  );
}

PromptInputTextarea.displayName = 'PromptInput.Textarea';
