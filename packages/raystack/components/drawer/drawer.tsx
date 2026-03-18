import { DrawerPreview as DrawerPrimitive } from '@base-ui/react/drawer';
import { DrawerContent } from './drawer-content';
import {
  DrawerBody,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from './drawer-misc';
import { DrawerRoot } from './drawer-root';

export type { DrawerContentProps } from './drawer-content';
export type { DrawerRootProps } from './drawer-root';

export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerPrimitive.Trigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Close: DrawerPrimitive.Close
});
