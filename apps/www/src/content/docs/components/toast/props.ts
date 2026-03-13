export interface ToastProviderProps {
  /**
   * Toast position on screen.
   * @default "bottom-right"
   */
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';

  /**
   * Maximum number of visible toasts.
   * @default 3
   */
  limit?: number;

  /**
   * Default auto-dismiss time in milliseconds.
   * @default 5000
   */
  timeout?: number;

  children?: React.ReactNode;
}

export interface ToastManagerAddOptions {
  /**
   * The title of the toast.
   */
  title?: React.ReactNode;

  /**
   * The description of the toast.
   */
  description?: React.ReactNode;

  /**
   * The type of the toast. Controls visual styling.
   */
  type?: 'success' | 'error' | 'info' | 'warning' | 'loading';

  /**
   * Auto-dismiss time in milliseconds. 0 prevents auto-dismiss.
   * @default 5000
   */
  timeout?: number;

  /**
   * Announcement priority for screen readers.
   * @default "low"
   */
  priority?: 'low' | 'high';

  /**
   * Callback when the toast is closed.
   */
  onClose?: () => void;

  /**
   * Callback when the toast is removed after closing animation completes.
   */
  onRemove?: () => void;

  /**
   * Props for the action button rendered in the toast.
   */
  actionProps?: React.ComponentPropsWithoutRef<'button'>;

  /**
   * Custom data to attach to the toast.
   */
  data?: Record<string, unknown>;

  /**
   * Optional custom ID for the toast. Auto-generated if not provided.
   */
  id?: string;
}
