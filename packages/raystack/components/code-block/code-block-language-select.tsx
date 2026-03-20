'use client';

import { cx } from 'class-variance-authority';
import { Language } from 'prism-react-renderer';
import { ComponentProps } from 'react';
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

CodeBlockLanguageSelect.displayName = 'CodeBlock.LanguageSelect';

export function CodeBlockLanguageSelectTrigger({
  className,
  ...props
}: ComponentProps<typeof Select.Trigger>) {
  return (
    <Select.Trigger
      className={cx(styles.languageSelectTrigger, className)}
      size='small'
      variant='text'
      {...props}
    >
      <Select.Value />
    </Select.Trigger>
  );
}

CodeBlockLanguageSelectTrigger.displayName = 'CodeBlock.LanguageSelectTrigger';
