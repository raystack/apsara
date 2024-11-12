import { Toaster, type ToasterProps, toast as sonnerToast } from "sonner";

interface ToastContainerProps extends ToasterProps {}

/**
 * @deprecated Use ToastContainer from '@raystack/apsara/v1' instead.
 */
function ToastContainer(props: ToastContainerProps) {
  return <Toaster {...props} />;
}

/**
 * @deprecated Use toast from '@raystack/apsara/v1' instead.
 */
const toast: typeof sonnerToast = Object.assign(
  (...props: Parameters<typeof sonnerToast>) => sonnerToast(...props),
  sonnerToast
);

ToastContainer.displayName = "ToastContainer";
(toast as typeof toast & { displayName: string }).displayName = "toast";

export { ToastContainer, toast };
