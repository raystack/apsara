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
   * Icon rendered before the toast title. Inherits color from the toast type
   * (e.g. green for `type: "success"`). Omit to use the default icon for the
   * toast type, pass any React node to override it, or pass `null` to render
   * no icon at all.
   */
  leadingIcon?: React.ReactNode;

  /**
   * Optional custom ID for the toast. Auto-generated if not provided.
   */
  id?: string;
}

/**
 * Options for `update(id, options)`. Same shape as `ToastManagerAddOptions`,
 * but every field is optional and the toast `id` moves to the first argument.
 */
export interface ToastManagerUpdateOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  type?: 'success' | 'error' | 'info' | 'warning' | 'loading';
  timeout?: number;
  priority?: 'low' | 'high';
  onClose?: () => void;
  onRemove?: () => void;
  actionProps?: React.ComponentPropsWithoutRef<'button'>;
  leadingIcon?: React.ReactNode;
}

/**
 * Options passed to `promise(promise, options)`. Each lifecycle stage accepts
 * a string (used as the toast description), an options object, or — for
 * `success`/`error` — a callable that receives the resolved value or
 * rejection reason and returns either of the above.
 */
export interface ToastManagerPromiseOptions<Value = unknown> {
  /**
   * Toast shown while the promise is pending. Auto-dismiss is disabled.
   *
   * @remarks `string | ToastManagerUpdateOptions`
   */
  loading: string | ToastManagerUpdateOptions;

  /**
   * Toast shown when the promise resolves. If a function, it receives the
   * resolved value and must return a string or update-options object.
   *
   * @remarks `string | ToastManagerUpdateOptions | ((result: Value) => string | ToastManagerUpdateOptions)`
   */
  success:
    | string
    | ToastManagerUpdateOptions
    | ((result: Value) => string | ToastManagerUpdateOptions);

  /**
   * Toast shown when the promise rejects. If a function, it receives the
   * rejection reason and must return a string or update-options object.
   *
   * @remarks `string | ToastManagerUpdateOptions | ((error: unknown) => string | ToastManagerUpdateOptions)`
   */
  error:
    | string
    | ToastManagerUpdateOptions
    | ((error: unknown) => string | ToastManagerUpdateOptions);
}

/**
 * Live snapshot of an active toast as exposed via `useToastManager().toasts`.
 * Read-only — to mutate, use the manager methods (`add`/`update`/`close`).
 */
export interface ToastObject {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  type?: 'success' | 'error' | 'info' | 'warning' | 'loading';
  timeout?: number;
  priority?: 'low' | 'high';
}

/**
 * The toast manager returned by `createToastManager()` and exported as the
 * `toastManager` singleton.
 */
export interface CreateToastManagerReturn {
  /**
   * Create a new toast and return its ID. The ID can later be passed to
   * `update` or `close`.
   *
   * @remarks `(options: ToastManagerAddOptions) => string`
   */
  add: (options: ToastManagerAddOptions) => string;

  /**
   * Close a specific toast by ID, or close all visible toasts if no ID is
   * given.
   *
   * @remarks `(id?: string) => void`
   */
  close: (id?: string) => void;

  /**
   * Update an existing toast in place. Typically used to swap a loading
   * toast to a success or error state without dismissing it.
   *
   * @remarks `(id: string, options: ToastManagerUpdateOptions) => void`
   */
  update: (id: string, options: ToastManagerUpdateOptions) => void;

  /**
   * Tie a toast's lifecycle to a promise. Renders the `loading` toast
   * immediately, then transitions to `success` or `error` when the promise
   * settles. Returns the original promise so callers can still `await` it.
   *
   * @remarks `<V>(promise: Promise<V>, options: ToastManagerPromiseOptions<V>) => Promise<V>`
   */
  promise: <Value>(
    promise: Promise<Value>,
    options: ToastManagerPromiseOptions<Value>
  ) => Promise<Value>;
}

/**
 * Return value of the `useToastManager()` hook. Same methods as
 * `createToastManager()` plus a reactive `toasts` array driving component
 * re-renders.
 */
export interface UseToastManagerReturn extends CreateToastManagerReturn {
  /**
   * Reactive array of currently-displayed toasts. The hook re-renders the
   * caller whenever this list changes.
   *
   * @remarks `ToastObject[]`
   */
  toasts: ToastObject[];
}
