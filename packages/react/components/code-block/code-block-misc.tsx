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
    <div
      className={cx(styles.content, className)}
      data-slot='code-block-content'
      {...props}
    >
      {children}
    </div>
  );
}

CodeBlockContent.displayName = 'CodeBlock.Content';

type FlexProps = ComponentProps<typeof Flex>;

interface CodeBlockHeaderProps extends FlexProps {
  /** @default "center" */
  align?: FlexProps['align'];
  /** @default 4 */
  gap?: FlexProps['gap'];
}

export function CodeBlockHeader({
  children,
  className,
  ...props
}: CodeBlockHeaderProps) {
  return (
    <Flex
      align='center'
      gap={4}
      className={cx(styles.header, className)}
      data-slot='code-block-header'
      {...props}
    >
      {children}
    </Flex>
  );
}

CodeBlockHeader.displayName = 'CodeBlock.Header';

type TextProps = ComponentProps<typeof Text>;

interface CodeBlockLabelProps extends TextProps {
  /** @default "regular" */
  size?: TextProps['size'];
}

export function CodeBlockLabel({
  children,
  className,
  ...props
}: CodeBlockLabelProps) {
  return (
    <Text
      size='regular'
      className={cx(styles.label, className)}
      data-slot='code-block-label'
      {...props}
    >
      {children}
    </Text>
  );
}

CodeBlockLabel.displayName = 'CodeBlock.Label';

export interface CodeBlockCollapseTriggerProps
  extends Omit<ComponentProps<typeof Button>, 'children'> {
  /** The label, or a function that gets `collapsed` and returns it. Defaults to "Show Code" while collapsed, otherwise "Hide Code". */
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
  const lineCount = code?.split(/\r\n|\r|\n/).length ?? 0;

  if (!canCollapse || lineCount <= maxLines) return null;

  return (
    <Button
      onClick={e => {
        toggleCollapsed(e.nativeEvent);
        onClick?.(e);
      }}
      variant='text'
      color='neutral'
      className={cx(
        styles.collapseTrigger,
        collapsed && styles.collapsed,
        className
      )}
      data-slot='code-block-collapse-trigger'
      {...props}
    >
      {typeof children === 'function' ? children(!!collapsed) : children}
    </Button>
  );
}

CodeBlockCollapseTrigger.displayName = 'CodeBlock.CollapseTrigger';

export interface CodeBlockCopyButtonProps
  extends Omit<ComponentProps<typeof CopyButton>, 'text'> {
  /**
   * The button style. `"floating"` places the button over the code and shows it on hover.
   * @default "default"
   */
  variant?: 'floating' | 'default';
  /** The button size. Defaults to `2` when `variant` is `"floating"`, otherwise `3`. */
  size?: 1 | 2 | 3 | 4;
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
      data-slot='code-block-copy-button'
      {...props}
    />
  );
}

CodeBlockCopyButton.displayName = 'CodeBlock.CopyButton';
