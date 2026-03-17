import { mergeProps, useRender } from '@base-ui/react';
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
  const gridItemStyle = {
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
  };

  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>({ style: gridItemStyle }, props)
  });

  return element;
}

GridItem.displayName = 'Grid.Item';
