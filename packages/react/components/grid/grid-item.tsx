import { mergeProps, useRender } from '@base-ui/react';
import { CSSProperties } from 'react';
import { AlignType } from './types';

export type GridItemProps = useRender.ComponentProps<'div'> & {
  /** Named area to place the item in. Must match a name in the parent's `templateAreas`. */
  area?: string;
  /** Column line where the item starts. */
  colStart?: number | string;
  /** Column line where the item ends. */
  colEnd?: number | string;
  /** Row line where the item starts. */
  rowStart?: number | string;
  /** Row line where the item ends. */
  rowEnd?: number | string;
  /** Number of columns the item spans. */
  colSpan?: number | string;
  /** Number of rows the item spans. */
  rowSpan?: number | string;
  /** Alignment of the item on the inline (row) axis in its grid area. */
  justifySelf?: AlignType;
  /** Alignment of the item on the block (column) axis in its grid area. */
  alignSelf?: AlignType;
};

export function GridItem({
  area,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  colSpan,
  rowSpan,
  justifySelf,
  alignSelf,
  style,
  render,
  ref,
  ...props
}: GridItemProps) {
  // `gridArea` is a shorthand. React writes `undefined` entries as an empty
  // value, and clearing any grid longhand after it also clears the shorthand,
  // so only the properties that were actually set are passed through.
  const gridItemStyle = Object.fromEntries(
    Object.entries({
      gridArea: area,
      gridColumnStart: colStart,
      gridColumnEnd: colEnd,
      gridRowStart: rowStart,
      gridRowEnd: rowEnd,
      gridColumn: colSpan ? `span ${colSpan}` : undefined,
      gridRow: rowSpan ? `span ${rowSpan}` : undefined,
      justifySelf,
      alignSelf,
      ...style
    }).filter(([, value]) => value !== undefined)
  ) as CSSProperties;

  const gridItemProps = { 'data-slot': 'grid-item', style: gridItemStyle };

  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(gridItemProps, props)
  });

  return element;
}

GridItem.displayName = 'Grid.Item';
