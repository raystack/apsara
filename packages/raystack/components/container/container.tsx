import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps, HTMLAttributes, PropsWithChildren } from 'react';

import styles from './container.module.css';

const container = cva(styles.container, {
  variants: {
    size: {
      small: styles['container-small'],
      medium: styles['container-medium'],
      large: styles['container-large'],
      none: styles['container-none']
    },
    align: {
      left: styles['container-align-left'],
      center: styles['container-align-center'],
      right: styles['container-align-right']
    }
  },
  defaultVariants: {
    size: 'none',
    align: 'center'
  }
});

type ContainerProps = VariantProps<typeof container> & ComponentProps<'div'>;

export function Container({
  children,
  size,
  align,
  className,
  role = 'region',
  ...props
}: ContainerProps) {
  return (
    <div
      className={container({ size, align, className })}
      role={role}
      {...props}
    >
      {children}
    </div>
  );
}

Container.displayName = 'Container';
