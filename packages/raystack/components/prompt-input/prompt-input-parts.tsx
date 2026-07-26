'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import styles from './prompt-input.module.css';

export interface PromptInputHeaderProps extends ComponentProps<'div'> {}

export function PromptInputHeader({
  className,
  ...props
}: PromptInputHeaderProps) {
  return <div className={cx(styles.header, className)} {...props} />;
}

PromptInputHeader.displayName = 'PromptInput.Header';

export interface PromptInputFooterProps extends ComponentProps<'div'> {}

export function PromptInputFooter({
  className,
  ...props
}: PromptInputFooterProps) {
  return <div className={cx(styles.footer, className)} {...props} />;
}

PromptInputFooter.displayName = 'PromptInput.Footer';
