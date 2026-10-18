import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import { DrawerContent } from './drawer-content';
import { DrawerIndent, DrawerIndentBackground } from './drawer-indent';
import {
  DrawerBody,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from './drawer-misc';
import { DrawerRoot } from './drawer-root';
import { DrawerSwipeArea } from './drawer-swipe-area';

export type { DrawerContentProps } from './drawer-content';
export type {
  DrawerIndentBackgroundProps,
  DrawerIndentProps
} from './drawer-indent';
export type { DrawerRootProps } from './drawer-root';
export type { DrawerSwipeAreaProps } from './drawer-swipe-area';

export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerPrimitive.Trigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Close: DrawerPrimitive.Close,
  SwipeArea: DrawerSwipeArea,
  Provider: DrawerPrimitive.Provider,
  Indent: DrawerIndent,
  IndentBackground: DrawerIndentBackground,
  createHandle: DrawerPrimitive.createHandle
});
