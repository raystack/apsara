'use client';

import { DrawerPreview as DrawerPrimitive } from '@base-ui/react/drawer';

type Side = 'top' | 'right' | 'bottom' | 'left';

const sideToSwipeDirection: Record<Side, Side> = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left'
};

export interface DrawerRootProps extends DrawerPrimitive.Root.Props {
  /** The direction from which the drawer appears and can be swiped to dismiss. */
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
