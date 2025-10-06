'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps, ElementRef, HTMLAttributes, forwardRef } from 'react';
import { Button } from '../button';
import { CopyButton } from '../copy-button';
import { Flex } from '../flex';
import { Text } from '../text';
import { useCodeBlockContext } from './code-block-root';
import styles from './code-block.module.css';

export const CodeBlockContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cx(styles.content, className)} {...props}>
      {children}
    </div>
  );
});

CodeBlockContent.displayName = 'CodeBlockContent';

export const CodeBlockHeader = forwardRef<
  ElementRef<typeof Flex>,
  ComponentProps<typeof Flex>
>(({ children, className, ...props }, ref) => {
  return (
    <Flex
      ref={ref}
      align='center'
      gap={4}
      className={cx(styles.header, className)}
      {...props}
    >
      {children}
    </Flex>
  );
});

CodeBlockHeader.displayName = 'CodeBlockHeader';

export const CodeBlockLabel = forwardRef<
  ElementRef<typeof Text>,
  ComponentProps<typeof Text>
>(({ children, className, ...props }, ref) => {
  return (
    <Text ref={ref} className={cx(styles.label, className)} {...props}>
      {children}
    </Text>
  );
});

CodeBlockLabel.displayName = 'CodeBlockLabel';

export const CodeBlockCollapseTrigger = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, children = 'Show Code', onClick, ...props }, ref) => {
  const { maxLines, collapsed, toggleCollapsed, code } = useCodeBlockContext();
  const canCollapse = maxLines && maxLines > 0;
  const lineCount = code?.split('\n').length ?? 0;

  if (!canCollapse || !collapsed || lineCount < maxLines) return null;

  return (
    <Button
      ref={ref}
      onClick={e => {
        toggleCollapsed();
        onClick?.(e);
      }}
      variant='text'
      color='neutral'
      className={cx(styles.collapseTrigger, className)}
      {...props}
    >
      {children}
    </Button>
  );
});

CodeBlockCollapseTrigger.displayName = 'CodeBlockCollapseTrigger';

export interface CodeBlockCopyButtonProps
  extends Omit<ComponentProps<typeof CopyButton>, 'text'> {
  variant?: 'floating' | 'default';
}

export const CodeBlockCopyButton = forwardRef<
  ElementRef<typeof CopyButton>,
  CodeBlockCopyButtonProps
>(({ className, variant = 'default', ...props }, ref) => {
  const { code = '' } = useCodeBlockContext();

  return (
    <CopyButton
      ref={ref}
      text={code}
      size={variant === 'floating' ? 2 : 3}
      className={cx(
        styles.copyButton,
        variant === 'floating' && styles.floatingCopyButton,
        className
      )}
      {...props}
    />
  );
});

CodeBlockCopyButton.displayName = 'CodeBlockCopyButton';
