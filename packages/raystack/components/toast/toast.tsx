import { Toast as ToastPrimitive } from '@base-ui/react';
import { ToastProvider } from './toast-provider';
import { ToastRoot } from './toast-root';

export const Toast = Object.assign(ToastRoot, {
  Provider: ToastProvider,
  createToastManager: ToastPrimitive.createToastManager,
  useToastManager: ToastPrimitive.useToastManager
});

export { toastManager } from './toast-manager';
