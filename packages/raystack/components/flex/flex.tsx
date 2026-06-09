import { mergeProps, useRender } from '@base-ui/react';
import { cva, VariantProps } from 'class-variance-authority';
import { gapVariants } from '~/shared/gap';
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
    gap: gapVariants
  },
  defaultVariants: {
    direction: 'row',
    align: 'stretch',
    justify: 'start',
    wrap: 'noWrap'
  }
});

type BoxProps = VariantProps<typeof flex> & useRender.ComponentProps<'div'>;

export function Flex({
  direction,
  align,
  justify,
  wrap,
  gap,
  className,
  render,
  ref,
  ...props
}: BoxProps) {
  const flexProps = {
    className: flex({
      direction,
      align,
      justify,
      wrap,
      gap,
      className
    })
  };

  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(flexProps, props)
  });

  return element;
}

Flex.displayName = 'Flex';
