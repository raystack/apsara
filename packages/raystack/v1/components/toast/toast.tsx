import { ReactNode } from "react";
import { Toaster, type ToasterProps, toast as sonnerToast } from "sonner";

interface ToastContainerProps extends ToasterProps {}

const ToastContainer = (props: ToastContainerProps) => {
  return <Toaster {...props} />;
};

const toast: typeof sonnerToast = Object.assign(
  (message: string | ReactNode, options?: ToasterProps) => {
    sonnerToast(
      <div style={{ marginRight: 8 }}>
        {message}
      </div>,
      options
    );
  },
  sonnerToast
);

ToastContainer.displayName = "ToastContainer";
(toast as typeof toast & { displayName: string }).displayName = "toast";

export { ToastContainer, toast };
