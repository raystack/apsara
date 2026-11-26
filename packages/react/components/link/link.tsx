import { useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { Text, type TextBaseProps } from '../text';
import styles from './link.module.css';

export interface LinkProps
  extends TextBaseProps,
    Omit<useRender.ComponentProps<'a'>, 'color'> {
  /**
   * Color of the text: a token level or an intent.
   * @default "accent"
   */
  color?: TextBaseProps['color'];
  /** Whether the link opens in a new tab. */
  external?: boolean;
  /** Whether the browser downloads the target. A string sets the file name. */
  download?: boolean | string;
}

export function Link({
  children,
  className,
  color = 'accent',
  size = 'small',
  external,
  download,
  render = <a />,
  ...props
}: LinkProps) {
  const userAriaLabel = props['aria-label'];
  const textLabel = typeof children === 'string' ? children : undefined;

  const externalProps = external
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label':
          userAriaLabel ??
          (textLabel ? `${textLabel} (opens in new tab)` : undefined)
      }
    : {};

  const downloadProps = download
    ? {
        download: typeof download === 'string' ? download : true,
        'aria-label':
          userAriaLabel ?? (textLabel ? `${textLabel} (download)` : undefined)
      }
    : {};

  return (
    <Text
      data-slot='link'
      className={cx(styles.link, className)}
      color={color}
      size={size}
      {...externalProps}
      {...downloadProps}
      {...props}
      render={render}
    >
      {children}
    </Text>
  );
}

Link.displayName = 'Link';
