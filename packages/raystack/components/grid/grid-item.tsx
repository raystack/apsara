import { mergeProps, useRender } from '@base-ui/react';
import { CSSProperties } from 'react';
import { AlignType } from './types';

type GridItemProps = useRender.ComponentProps<'div'> & {
  area?: string;
  colStart?: number | string;
  colEnd?: number | string;
  rowStart?: number | string;
  rowEnd?: number | string;
  colSpan?: number | string;
  rowSpan?: number | string;
  justifySelf?: AlignType;
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
