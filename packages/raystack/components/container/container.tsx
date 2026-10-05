import { mergeProps, useRender } from '@base-ui/react';
import { cva, VariantProps } from 'class-variance-authority';

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

type ContainerProps = VariantProps<typeof container> &
  useRender.ComponentProps<'div'>;

export function Container({
  size,
  align,
  className,
  role,
  render,
  ref,
  ...props
}: ContainerProps) {
  const hasLabel = !!(props['aria-label'] || props['aria-labelledby']);
  const containerProps = {
    'data-slot': 'container',
    className: container({ size, align, className }),
    // A custom element keeps its implicit role, for example `main`.
    role: role ?? (hasLabel && !render ? 'region' : undefined)
  };

  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(containerProps, props)
  });
}

Container.displayName = 'Container';
