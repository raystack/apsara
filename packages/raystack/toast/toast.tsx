import React from "react";
import { Toaster, type ToasterProps, toast as sonnerToast } from "sonner";

interface ToastContainerProps extends ToasterProps {}

const ToastContainer = (props: ToastContainerProps) => {
  return <Toaster {...props} />;
};

const toast: typeof sonnerToast = Object.assign(
  (message: string, options?: { icon?: React.ReactNode; }) => {
    const { icon, ...restOptions } = options || {};
    sonnerToast(message, { icon, ...restOptions });
  },
  sonnerToast
);

ToastContainer.displayName = "ToastContainer";
(toast as typeof toast & { displayName: string }).displayName = "toast";

export { ToastContainer, toast };
