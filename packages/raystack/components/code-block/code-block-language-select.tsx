'use client';

import { cx } from 'class-variance-authority';
import { Language } from 'prism-react-renderer';
import { ComponentProps, ElementRef, forwardRef } from 'react';
import { Select } from '../select';
import { SingleSelectProps } from '../select/select-root';
import styles from './code-block.module.css';
import { useCodeBlockContext } from './code-block-root';

export const CodeBlockLanguageSelect = (props: SingleSelectProps) => {
  const { value, setValue } = useCodeBlockContext();

  const handleValueChange = (value: string) => {
    setValue(value as Language);
  };
  return <Select onValueChange={handleValueChange} value={value} {...props} />;
};

CodeBlockLanguageSelect.displayName = 'CodeBlockLanguageSelect';

export const CodeBlockLanguageSelectTrigger = forwardRef<
  ElementRef<typeof Select.Trigger>,
  ComponentProps<typeof Select.Trigger>
>(({ className, ...props }, ref) => {
  return (
    <Select.Trigger
      ref={ref}
      className={cx(styles.languageSelectTrigger, className)}
      size='small'
      variant='text'
      {...props}
    >
      <Select.Value />
    </Select.Trigger>
  );
});

CodeBlockLanguageSelectTrigger.displayName = 'CodeBlockLanguageSelectTrigger';
