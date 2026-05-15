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
      left: styles['headline-align-left'],
      center: styles['headline-align-center'],
      right: styles['headline-align-right']
    },
    truncate: {
      true: styles['headline-truncate']
    }
  },
  defaultVariants: {
    size: 't2',
    weight: 'medium',
    align: 'left',
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
  const element = useRender({
    defaultTagName: 'h2',
    ref,
    render,
    props: mergeProps<'h2'>(
      { className: headline({ size, weight, align, truncate, className }) },
      props
    )
  });

  return element;
}

Headline.displayName = 'Headline';
