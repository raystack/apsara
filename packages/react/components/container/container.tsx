import { mergeProps, useRender } from '@base-ui/react';
import { cva, VariantProps } from 'class-variance-authority';

import styles from './container.module.css';

const container = cva(styles.container, {
  variants: {
    /** Maximum width: `small` is 430px, `medium` is 715px, `large` is 1145px, and `none` has no limit. */
    size: {
      small: styles['container-small'],
      medium: styles['container-medium'],
      large: styles['container-large'],
      none: styles['container-none']
    },
    /** Position in the parent. `start` and `end` follow the text direction. */
    align: {
      start: styles['align-start'],
      center: styles['align-center'],
      end: styles['align-end']
    }
  },
  defaultVariants: {
    size: 'none',
    align: 'center'
  }
});

export type ContainerProps = VariantProps<typeof container> &
  useRender.ComponentProps<'div'> & {
    /** Accessible name. With no `role` or `render`, it also sets `role="region"`. */
    'aria-label'?: string;
    /** ID of the element that names the container. With no `role` or `render`, it also sets `role="region"`. */
    'aria-labelledby'?: string;
  };

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
