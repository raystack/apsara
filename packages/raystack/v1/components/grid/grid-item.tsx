import { Slot } from 'radix-ui';
import { HTMLAttributes, forwardRef } from 'react';
import { AlignType } from './types';

type GridItemProps = HTMLAttributes<HTMLDivElement> & {
  area?: string;
  colStart?: number | string;
  colEnd?: number | string;
  rowStart?: number | string;
  rowEnd?: number | string;
  colSpan?: number | string;
  rowSpan?: number | string;
  justifySelf?: AlignType;
  alignSelf?: AlignType;
  asChild?: boolean;
};

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
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
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot.Root : 'div';

    return (
      <Comp
        ref={ref}
        style={{
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
        }}
        {...props}
      />
    );
  }
);

GridItem.displayName = 'GridItem';
