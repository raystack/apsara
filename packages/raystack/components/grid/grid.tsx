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
    gap: gapVariants,
    columnGap: columnGapVariants,
    rowGap: rowGapVariants
  }
});

type GridProps = useRender.ComponentProps<'div'> &
  VariantProps<typeof grid> & {
    /**
     * Supports CSS Grid template areas syntax.
     *
     * @example
     * <Grid templateAreas="header header header" />
     * <Grid templateAreas={["header header header", "sidebar main main", "footer footer footer"]} />
     */
    templateAreas?: string | string[];
    autoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
    autoColumns?: string;
    autoRows?: string;

    /**
     * Supports CSS Grid template columns syntax.
     *
     * If you pass a number, columns will be created using repeat(n, 1fr).
     *
     * @example
     * <Grid columns="1fr 1fr 1fr" />
     * <Grid columns={3} />
     */
    columns?: string | number;

    /**
     * Supports CSS Grid template rows syntax.
     *
     * If you pass a number, rows will be created using repeat(n, 1fr).
     *
     * @example
     * <Grid rows="1fr 1fr 1fr" />
     * <Grid rows={3} />
     */
    rows?: string | number;
    justifyItems?: AlignType;
    alignItems?: AlignType;
    justifyContent?: AlignExtendedType;
    alignContent?: AlignExtendedType;
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
  alignItems,
  justifyContent,
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
    alignItems,
    justifyContent,
    alignContent,
    ...style
  };

  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: grid({ inline, gap, columnGap, rowGap, className }),
        style: gridStyle
      },
      props
    )
  });

  return element;
}

Grid.displayName = 'Grid';
