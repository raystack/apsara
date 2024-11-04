import React from "react";
import { Toaster, type ToasterProps, toast as sonnerToast } from "sonner";

interface ToastContainerProps extends ToasterProps {}

const ToastContainer = (props: ToastContainerProps) => {
  return <Toaster {...props} />;
};

interface ToastOptions {
  icon?: React.ReactNode;
  duration?: number;
  action?: React.ReactNode;
}

const toast: typeof sonnerToast = Object.assign(
  (message: string | React.ReactNode, options?: ToastOptions) => {
    const { icon, duration, action, ...restOptions } = options || {};
    sonnerToast(
      <div>
        {message}
        {action && <div style={{ marginTop: '8px' }}>{action}</div>}
      </div>,
      { icon, duration, ...restOptions }
    );
  },
  sonnerToast
);

ToastContainer.displayName = "ToastContainer";
(toast as typeof toast & { displayName: string }).displayName = "toast";

export { ToastContainer, toast };
