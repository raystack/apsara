'use client';

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import { createContext, useContext } from 'react';

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

const DrawerSideContext = createContext<Side>('right');

export const useDrawerSide = () => useContext(DrawerSideContext);

export interface DrawerRootProps extends DrawerPrimitive.Root.Props {
  /**
   * The edge the drawer slides in from. It also sets the swipe-to-dismiss direction.
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
    <DrawerSideContext value={side}>
      <DrawerPrimitive.Root
        swipeDirection={swipeDirection ?? sideToSwipeDirection[side]}
        {...props}
      />
    </DrawerSideContext>
  );
}
DrawerRoot.displayName = 'Drawer';
