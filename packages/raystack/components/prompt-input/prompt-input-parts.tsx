'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { Button } from '../button';
import styles from './prompt-input.module.css';
import { usePromptInputContext } from './prompt-input-context';

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

export interface PromptInputButtonProps extends ComponentProps<typeof Button> {}

export function PromptInputButton({
  className,
  variant = 'ghost',
  color = 'neutral',
  size = 'small',
  type = 'button',
  disabled,
  ...props
}: PromptInputButtonProps) {
  const context = usePromptInputContext('Button');
  return (
    <Button
      type={type}
      variant={variant}
      color={color}
      size={size}
      disabled={disabled ?? context.disabled}
      className={cx(styles.button, className)}
      {...props}
    />
  );
}

PromptInputButton.displayName = 'PromptInput.Button';
