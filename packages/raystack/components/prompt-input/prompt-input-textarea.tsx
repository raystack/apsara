'use client';

import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { cx } from 'class-variance-authority';
import { ChangeEvent, KeyboardEvent } from 'react';
import { TextArea, type TextAreaProps } from '../text-area/text-area';
import styles from './prompt-input.module.css';
import { usePromptInputContext } from './prompt-input-context';

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
  const mergedRef = useMergedRefs(context.registerInput, ref);

  const resolvedDisabled = disabled ?? context.disabled;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event);
    context.setValue(event.target.value);
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
