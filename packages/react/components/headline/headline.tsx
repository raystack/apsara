import { mergeProps, useRender } from '@base-ui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './headline.module.css';

const headline = cva(styles.headline, {
  variants: {
    size: {
      t1: styles['headline-t1'],
      t2: styles['headline-t2'],
      t3: styles['headline-t3'],
      t4: styles['headline-t4']
    },
    weight: {
      regular: styles['headline-weight-regular'],
      medium: styles['headline-weight-medium']
    },
    align: {
      start: styles['align-start'],
      center: styles['align-center'],
      end: styles['align-end']
    },
    truncate: {
      true: styles['headline-truncate']
    }
  },
  defaultVariants: {
    size: 't2',
    weight: 'medium',
    align: 'start',
    truncate: false
  }
});

export type HeadlineBaseProps = VariantProps<typeof headline>;

export type HeadlineProps = HeadlineBaseProps & useRender.ComponentProps<'h2'>;

export function Headline({
  className,
  size,
  weight,
  align,
  truncate,
  render,
  ref,
  ...props
}: HeadlineProps) {
  const headlineProps = {
    'data-slot': 'headline',
    className: headline({ size, weight, align, truncate, className })
  };

  const element = useRender({
    defaultTagName: 'h2',
    ref,
    render,
    props: mergeProps<'h2'>(headlineProps, props)
  });

  return element;
}

Headline.displayName = 'Headline';
