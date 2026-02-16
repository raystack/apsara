import { Dialog as DialogPrimitive } from '@base-ui/react';
import { SheetContent } from './sheet-content';
import {
  SheetBody,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from './sheet-misc';

export type { SheetContentProps } from './sheet-content';

export const Sheet = Object.assign(DialogPrimitive.Root, {
  Trigger: DialogPrimitive.Trigger,
  Content: SheetContent,
  Header: SheetHeader,
  Title: SheetTitle,
  Description: SheetDescription,
  Body: SheetBody,
  Footer: SheetFooter,
  Close: DialogPrimitive.Close
});
