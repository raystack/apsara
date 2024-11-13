import { ReactNode } from "react";
import { Toaster, type ToasterProps, toast as sonnerToast } from "sonner";
import { useTheme } from "../themprovider";
import { UseThemeProps } from "../themprovider/types";
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
      <div style={{ marginRight: 8 }}>
        {message}
      </div>,
      options
    );
  },
  sonnerToast
);

(toast as typeof toast & { displayName: string }).displayName = "toast";

ToastContainer.displayName = "ToastContainer";

export { ToastContainer, toast };
