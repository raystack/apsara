import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react';
import { AlertDialogContent } from './alert-dialog-content';
import {
  AlertDialogBody,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from './alert-dialog-misc';

export const AlertDialog = Object.assign(AlertDialogPrimitive.Root, {
  Header: AlertDialogHeader,
  Footer: AlertDialogFooter,
  Body: AlertDialogBody,
  Trigger: AlertDialogPrimitive.Trigger,
  Content: AlertDialogContent,
  Close: AlertDialogPrimitive.Close,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  createHandle: AlertDialogPrimitive.createHandle
});
