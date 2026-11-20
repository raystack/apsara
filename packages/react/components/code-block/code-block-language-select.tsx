'use client';

import { cx } from 'class-variance-authority';
import { Language } from 'prism-react-renderer';
import { ComponentProps } from 'react';
import { Select } from '../select';
import { SingleSelectProps } from '../select/select-root';
import styles from './code-block.module.css';
import { useCodeBlockContext } from './code-block-root';

export type CodeBlockLanguageSelectProps = SingleSelectProps;

export const CodeBlockLanguageSelect = (
  props: CodeBlockLanguageSelectProps
) => {
  const { value, setValue } = useCodeBlockContext();

  const handleValueChange = (value: string) => {
    setValue(value as Language);
  };
  // The value is unset until a CodeBlock.Code sets it. Pass '' so the Select
  // is controlled from its first render.
  return (
    <Select onValueChange={handleValueChange} value={value ?? ''} {...props} />
  );
};

CodeBlockLanguageSelect.displayName = 'CodeBlock.LanguageSelect';

type SelectTriggerProps = ComponentProps<typeof Select.Trigger>;

interface CodeBlockLanguageSelectTriggerProps extends SelectTriggerProps {
  /** @default "small" */
  size?: SelectTriggerProps['size'];
  /** @default "text" */
  variant?: SelectTriggerProps['variant'];
}

export function CodeBlockLanguageSelectTrigger({
  className,
  ...props
}: CodeBlockLanguageSelectTriggerProps) {
  return (
    <Select.Trigger
      className={cx(styles.languageSelectTrigger, className)}
      size='small'
      variant='text'
      data-slot='code-block-language-select-trigger'
      {...props}
    >
      <Select.Value data-slot='code-block-language-select-value' />
    </Select.Trigger>
  );
}

CodeBlockLanguageSelectTrigger.displayName = 'CodeBlock.LanguageSelectTrigger';
