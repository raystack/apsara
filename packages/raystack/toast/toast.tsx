import { Toaster, type ToasterProps, toast as sonnerToast } from "sonner";

interface ToastContainerProps extends ToasterProps {}

function ToastContainer(props: ToastContainerProps) {
  return <Toaster {...props} />;
}

const toast: typeof sonnerToast = Object.assign(
  (...props: Parameters<typeof sonnerToast>) => sonnerToast(...props),
  sonnerToast
);

ToastContainer.displayName = "ToastContainer";
(toast as typeof toast & { displayName: string }).displayName = "toast";

export { ToastContainer, toast };
