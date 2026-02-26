import { Toast as ToastPrimitive } from '@base-ui/react';
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport
} from './toast-misc';
import { ToastProvider } from './toast-provider';
import { ToastRoot } from './toast-root';

export const Toast = Object.assign(ToastRoot, {
  Provider: ToastProvider,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
  Viewport: ToastViewport,
  createToastManager: ToastPrimitive.createToastManager,
  useToastManager: ToastPrimitive.useToastManager
});

export { toastManager } from './toast-manager';
