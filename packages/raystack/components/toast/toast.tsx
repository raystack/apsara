import { Toast as ToastPrimitive } from '@base-ui/react';
import { createToastManager } from './toast-manager';
import { ToastProvider } from './toast-provider';
import { ToastRoot } from './toast-root';

export const Toast = Object.assign(ToastRoot, {
  Provider: ToastProvider,
  createToastManager,
  useToastManager: ToastPrimitive.useToastManager
});

export { toastManager } from './toast-manager';
