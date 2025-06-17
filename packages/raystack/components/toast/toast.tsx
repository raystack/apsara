import { ReactNode } from "react";
import { toast as sonnerToast,Toaster, type ToasterProps } from "sonner";

import { useTheme } from "../theme-provider";
import { UseThemeProps } from "../theme-provider/types";
import styles from "./toast.module.css";

interface ToastContainerProps extends ToasterProps {}

const ToastContainer = (props: ToastContainerProps) => {
  const { resolvedTheme } = useTheme();
  
  return (
    <Toaster 
      theme={resolvedTheme as UseThemeProps['systemTheme']} 
      className={styles["raystack-toast"]}
      {...props} 
    />
  );
};

const toast: typeof sonnerToast = Object.assign(
  (message: string | ReactNode, options?: ToasterProps) => {
    sonnerToast(
      <div className={styles["toast-wrapper"]}>
        {message}
      </div>,
      options
    );
  },
  sonnerToast
);

(toast as typeof toast & { displayName: string }).displayName = "toast";

ToastContainer.displayName = "ToastContainer";

export { toast,ToastContainer };
