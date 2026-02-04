import { Dialog as DialogPrimitive } from '@base-ui/react';
import { DialogContent } from './dialog-content';
import {
  CloseButton,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './dialog-misc';

export const Dialog = Object.assign(DialogPrimitive.Root, {
  Header: DialogHeader,
  Footer: DialogFooter,
  Body: DialogBody,
  Trigger: DialogPrimitive.Trigger,
  Content: DialogContent,
  Close: DialogPrimitive.Close,
  CloseButton: CloseButton,
  Title: DialogTitle,
  Description: DialogDescription
});
