'use client';

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';

type Side = 'top' | 'right' | 'bottom' | 'left';

const sideToSwipeDirection: Record<
  Side,
  DrawerPrimitive.Root.Props['swipeDirection']
> = {
  top: 'up',
  right: 'right',
  bottom: 'down',
  left: 'left'
};

export interface DrawerRootProps extends DrawerPrimitive.Root.Props {
  /**
   * The edge the user swipes the drawer toward to dismiss it.
   * @default 'right'
   */
  side?: Side;
}

export function DrawerRoot({
  side = 'right',
  swipeDirection,
  ...props
}: DrawerRootProps) {
  return (
    <DrawerPrimitive.Root
      swipeDirection={swipeDirection ?? sideToSwipeDirection[side]}
      {...props}
    />
  );
}
DrawerRoot.displayName = 'Drawer';
