import { VariantProps, cva } from 'class-variance-authority';
import { HTMLAttributes, PropsWithChildren, forwardRef } from 'react';

import styles from './flex.module.css';

const flex = cva(styles.flex, {
  variants: {
    direction: {
      row: styles['direction-row'],
      column: styles['direction-column'],
      rowReverse: styles['direction-rowReverse'],
      columnReverse: styles['direction-columnReverse']
    },
    align: {
      start: styles['align-start'],
      center: styles['align-center'],
      end: styles['align-end'],
      stretch: styles['align-stretch'],
      baseline: styles['align-baseline']
    },
    justify: {
      start: styles['justify-start'],
      center: styles['justify-center'],
      end: styles['justify-end'],
      between: styles['justify-between']
    },
    wrap: {
      noWrap: styles['wrap-noWrap'],
      wrap: styles['wrap-wrap'],
      wrapReverse: styles['wrap-wrapReverse']
    },
    gap: {
      1: styles['gap-1'],
      2: styles['gap-2'],
      3: styles['gap-3'],
      4: styles['gap-4'],
      5: styles['gap-5'],
      6: styles['gap-6'],
      7: styles['gap-7'],
      8: styles['gap-8'],
      9: styles['gap-9'],
      'extra-small': styles['gap-xs'],
      small: styles['gap-sm'],
      medium: styles['gap-md'],
      large: styles['gap-lg'],
      'extra-large': styles['gap-xl']
    },
    width: {
      full: styles['width-full']
    }
  },
  defaultVariants: {
    direction: 'row',
    align: 'stretch',
    justify: 'start',
    wrap: 'noWrap'
  }
});

type BoxProps = PropsWithChildren<VariantProps<typeof flex>> &
  HTMLAttributes<HTMLDivElement>;

export const Flex = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      children,
      direction,
      align,
      justify,
      wrap,
      gap,
      className,
      width,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={flex({
          direction,
          align,
          justify,
          wrap,
          gap,
          className,
          width
        })}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);
