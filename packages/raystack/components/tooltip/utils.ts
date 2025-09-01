import { Tooltip as TooltipPrimitive } from 'radix-ui';

type MousePosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const getTransformForPlacement = (
  side: NonNullable<TooltipPrimitive.TooltipContentProps['side']>,
  align: NonNullable<TooltipPrimitive.TooltipContentProps['align']>,
  { x, y, width, height }: MousePosition
): string => {
  const transforms = {
    top: {
      start: `translate(${x}px, ${y}px)`,
      center: `translate(${x - width / 2}px, ${y}px)`,
      end: `translate(${x - width}px, ${y}px)`
    },
    bottom: {
      start: `translate(${x}px, ${y - height}px)`,
      center: `translate(${x - width / 2}px, ${y - height}px)`,
      end: `translate(${x - width}px, ${y - height}px)`
    },
    left: {
      start: `translate(${x}px, ${y}px)`,
      center: `translate(${x}px, ${y - height / 2}px)`,
      end: `translate(${x}px, ${y - height}px)`
    },
    right: {
      start: `translate(${x - width}px, ${y}px)`,
      center: `translate(${x - width}px, ${y - height / 2}px)`,
      end: `translate(${x - width}px, ${y - height}px)`
    }
  };

  return transforms[side][align];
};
