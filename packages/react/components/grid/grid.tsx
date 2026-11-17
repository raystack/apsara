import { mergeProps, useRender } from '@base-ui/react';
import { cva, VariantProps } from 'class-variance-authority';
import { useMemo } from 'react';
import { columnGapVariants, gapVariants, rowGapVariants } from '~/shared/gap';
import styles from './grid.module.css';
import { AlignExtendedType, AlignType } from './types';

const grid = cva(styles.grid, {
  variants: {
    inline: {
      true: styles['grid-inline'],
      false: null
    },
    /** Space between the items. `0` removes it, and steps 1 to 17 use `--rs-space-1` to `--rs-space-17`. */
    gap: gapVariants,
    /** Space between the columns, on the same scale as `gap`. */
    columnGap: columnGapVariants,
    /** Space between the rows, on the same scale as `gap`. */
    rowGap: rowGapVariants
  }
});

const toCssAlignment = (value?: AlignExtendedType) =>
  value === 'between' || value === 'around' || value === 'evenly'
    ? `space-${value}`
    : value;

export type GridProps = useRender.ComponentProps<'div'> &
  VariantProps<typeof grid> & {
    /** Named grid areas in `grid-template-areas` syntax. An array takes one string per row. */
    templateAreas?: string | string[];
    /** How auto-placed items flow into the grid. Sets `grid-auto-flow`. */
    autoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
    /** Size of the implicit columns. Sets `grid-auto-columns`. */
    autoColumns?: string;
    /** Size of the implicit rows. Sets `grid-auto-rows`. */
    autoRows?: string;
    /** Columns in `grid-template-columns` syntax. A number `n` creates `repeat(n, 1fr)`. */
    columns?: string | number;
    /** Rows in `grid-template-rows` syntax. A number `n` creates `repeat(n, 1fr)`. */
    rows?: string | number;
    /** Alignment of the items on the inline (row) axis. Sets `justify-items`. */
    justifyItems?: AlignType;
    /** Alignment of the items on the block (column) axis. Sets `align-items`. */
    align?: AlignType;
    /** Alignment of the whole grid on the inline (row) axis. Sets `justify-content`. */
    justify?: AlignExtendedType;
    /** Alignment of the whole grid on the block (column) axis. Sets `align-content`. */
    alignContent?: AlignExtendedType;
    /**
     * Renders as `inline-grid` instead of `grid`.
     * @default false
     */
    inline?: boolean;
  };

export function Grid({
  templateAreas,
  autoFlow,
  autoColumns,
  autoRows,
  columns,
  rows,
  gap,
  columnGap,
  rowGap,
  justifyItems,
  align,
  justify,
  alignContent,
  inline = false,
  className,
  style = {},
  render,
  ref,
  ...props
}: GridProps) {
  const gridTemplateColumns =
    typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns;
  const gridTemplateRows =
    typeof rows === 'number' ? `repeat(${rows}, 1fr)` : rows;

  const gridTemplateAreas = useMemo(() => {
    if (Array.isArray(templateAreas)) {
      return templateAreas
        .map(area => `"${area}"`)
        .join(' ')
        .trim();
    }
    return templateAreas;
  }, [templateAreas]);

  const gridStyle = {
    gridTemplateAreas,
    gridAutoFlow: autoFlow,
    gridAutoColumns: autoColumns,
    gridAutoRows: autoRows,
    gridTemplateColumns,
    gridTemplateRows,
    justifyItems,
    alignItems: align,
    justifyContent: toCssAlignment(justify),
    alignContent: toCssAlignment(alignContent),
    ...style
  };

  const gridProps = {
    'data-slot': 'grid',
    className: grid({ inline, gap, columnGap, rowGap, className }),
    style: gridStyle
  };

  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(gridProps, props)
  });

  return element;
}

Grid.displayName = 'Grid';
