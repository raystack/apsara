'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';
import { Button } from '../button';
import { CopyButton } from '../copy-button';
import { Flex } from '../flex';
import { Text } from '../text';
import styles from './code-block.module.css';
import { useCodeBlockContext } from './code-block-root';

export function CodeBlockContent({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className={cx(styles.content, className)} {...props}>
      {children}
    </div>
  );
}

CodeBlockContent.displayName = 'CodeBlock.Content';

export function CodeBlockHeader({
  children,
  className,
  ...props
}: ComponentProps<typeof Flex>) {
  return (
    <Flex
      align='center'
      gap={4}
      className={cx(styles.header, className)}
      {...props}
    >
      {children}
    </Flex>
  );
}

CodeBlockHeader.displayName = 'CodeBlock.Header';

export function CodeBlockLabel({
  children,
  className,
  ...props
}: ComponentProps<typeof Text>) {
  return (
    <Text className={cx(styles.label, className)} {...props}>
      {children}
    </Text>
  );
}

CodeBlockLabel.displayName = 'CodeBlock.Label';

export interface CodeBlockCollapseTriggerProps
  extends Omit<ComponentProps<typeof Button>, 'children'> {
  children?: ReactNode | ((collapsed: boolean) => ReactNode);
}

export function CodeBlockCollapseTrigger({
  className,
  children = collapsed => (collapsed ? 'Show Code' : 'Hide Code'),
  onClick,
  ...props
}: CodeBlockCollapseTriggerProps) {
  const { maxLines, collapsed, toggleCollapsed, code } = useCodeBlockContext();
  const canCollapse = maxLines && maxLines > 0;
  const lineCount = code?.split('\n').length ?? 0;

  if (!canCollapse || lineCount < maxLines) return null;

  return (
    <Button
      onClick={e => {
        toggleCollapsed();
        onClick?.(e);
      }}
      variant='text'
      color='neutral'
      className={cx(
        styles.collapseTrigger,
        collapsed && styles.collapsed,
        className
      )}
      {...props}
    >
      {typeof children === 'function' ? children(!!collapsed) : children}
    </Button>
  );
}

CodeBlockCollapseTrigger.displayName = 'CodeBlock.CollapseTrigger';

export interface CodeBlockCopyButtonProps
  extends Omit<ComponentProps<typeof CopyButton>, 'text'> {
  variant?: 'floating' | 'default';
}

export function CodeBlockCopyButton({
  className,
  variant = 'default',
  ...props
}: CodeBlockCopyButtonProps) {
  const { code = '' } = useCodeBlockContext();

  return (
    <CopyButton
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
}

CodeBlockCopyButton.displayName = 'CodeBlock.CopyButton';
