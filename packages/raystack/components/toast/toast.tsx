import { createToastManager } from './toast-manager';
import { ToastProvider } from './toast-provider';
import { ToastRoot } from './toast-root';

export const Toast = Object.assign(ToastRoot, {
  Provider: ToastProvider,
  createToastManager
});

export { toastManager, useToastManager } from './toast-manager';
