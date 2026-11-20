import { mergeProps, useRender } from '@base-ui/react';
import { cva, VariantProps } from 'class-variance-authority';
import { gapVariants } from '~/shared/gap';
import styles from './flex.module.css';

const flex = cva(styles.flex, {
  variants: {
    /** Renders as `inline-flex` instead of `flex`. */
    inline: {
      true: styles['flex-inline'],
      false: null
    },
    /** Direction of the main axis. */
    direction: {
      row: styles['direction-row'],
      column: styles['direction-column'],
      rowReverse: styles['direction-rowReverse'],
      columnReverse: styles['direction-columnReverse']
    },
    /** Alignment of the items on the cross axis. */
    align: {
      start: styles['align-start'],
      center: styles['align-center'],
      end: styles['align-end'],
      stretch: styles['align-stretch'],
      baseline: styles['align-baseline']
    },
    /** Distribution of the items on the main axis. */
    justify: {
      start: styles['justify-start'],
      center: styles['justify-center'],
      end: styles['justify-end'],
      between: styles['justify-between']
    },
    /** How the items wrap onto more lines. */
    wrap: {
      noWrap: styles['wrap-noWrap'],
      wrap: styles['wrap-wrap'],
      wrapReverse: styles['wrap-wrapReverse']
    },
    /** Space between the items. `0` removes it, and steps 1 to 17 use `--rs-space-1` to `--rs-space-17`. */
    gap: gapVariants
  },
  defaultVariants: {
    inline: false,
    direction: 'row',
    align: 'stretch',
    justify: 'start',
    wrap: 'noWrap'
  }
});

export type FlexProps = VariantProps<typeof flex> &
  useRender.ComponentProps<'div'>;

export function Flex({
  inline,
  direction,
  align,
  justify,
  wrap,
  gap,
  className,
  render,
  ref,
  ...props
}: FlexProps) {
  const flexProps = {
    'data-slot': 'flex',
    className: flex({
      inline,
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
