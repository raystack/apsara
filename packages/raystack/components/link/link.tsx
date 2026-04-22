import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { Text, type TextBaseProps } from '../text';
import styles from './link.module.css';

export interface LinkProps extends TextBaseProps, ComponentProps<'a'> {
  href: string;
  external?: boolean;
  download?: boolean | string;
}

export function Link({
  children,
  className,
  variant = 'accent',
  size = 'small',
  external,
  download,
  ...props
}: LinkProps) {
  const externalProps = external
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `${children} (opens in new tab)`
      }
    : {};

  const downloadProps = download
    ? {
        download: typeof download === 'string' ? download : true,
        'aria-label': `${children} (download)`
      }
    : {};

  return (
    <Text
      className={cx(styles.link, className)}
      variant={variant}
      size={size}
      role='link'
      {...externalProps}
      {...downloadProps}
      {...props}
      render={<a />}
    >
      {children}
    </Text>
  );
}

Link.displayName = 'Link';
