import React, { forwardRef } from 'react';

import { Language } from 'prism-react-renderer';
import { Select } from '../select';
import { useCodeBlockContext } from './code-block-root';
import styles from './code-block.module.css';

export interface CodeBlockLanguageSelectProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CodeBlockLanguageSelect = forwardRef<
  HTMLDivElement,
  CodeBlockLanguageSelectProps
>(({ children, className, ...props }, ref) => {
  const { selectedLanguage, setSelectedLanguage } = useCodeBlockContext();

  const handleValueChange = (value: string) => {
    setSelectedLanguage(value as Language);
  };
  return (
    <Select onValueChange={handleValueChange} value={selectedLanguage}>
      {children}
    </Select>
  );
});

CodeBlockLanguageSelect.displayName = 'CodeBlockLanguageSelect';

export interface CodeBlockLanguageSelectTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const CodeBlockLanguageSelectTrigger = forwardRef<
  HTMLButtonElement,
  CodeBlockLanguageSelectTriggerProps
>(({ className, ...props }, ref) => {
  return (
    <Select.Trigger
      ref={ref}
      className={`${styles.languageSelectTrigger} ${className || ''}`}
      {...props}
    >
      <Select.Value />
    </Select.Trigger>
  );
});

CodeBlockLanguageSelectTrigger.displayName = 'CodeBlockLanguageSelectTrigger';
