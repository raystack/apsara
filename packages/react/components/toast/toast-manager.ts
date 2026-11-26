'use client';

import {
  type ToastManagerUpdateOptions,
  type ToastObject,
  Toast as ToastPrimitive
} from '@base-ui/react';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

export interface ToastData {
  /**
   * Icon rendered before the toast title. Inherits color from the toast type
   * (e.g. green for `type: "success"`).
   *
   * - Omit (or pass `undefined`) to use the default icon for the toast type.
   * - Pass any React node to override the icon.
   * - Pass `null` to render no icon at all (opt out of type defaults).
   */
  leadingIcon?: ReactNode;
}

type BaseManager = ReturnType<
  typeof ToastPrimitive.createToastManager<ToastData>
>;

interface ToastOptions extends ToastData {
  /** Type of the toast: `success`, `error`, `warning`, `info`, or `loading`. It sets the default icon and its color. */
  type?: string;
  /**
   * Shows an arrow that points at the anchor. Only anchored toasts use it.
   * @default false
   */
  showArrow?: boolean;
}

/** Public option shape: hides Base UI's internal storage slot and exposes `leadingIcon` directly. */
type WithModifiedOptions<T> = Omit<T, 'data'> & ToastOptions;

export type ToastAddOptions = WithModifiedOptions<
  Parameters<BaseManager['add']>[0]
>;

export type ToastUpdateOptions = WithModifiedOptions<
  ToastManagerUpdateOptions<ToastData>
>;

export type ToastUpdater =
  | ToastUpdateOptions
  | ((prevToast: ToastObject<ToastData>) => ToastUpdateOptions);

export interface ToastPromiseOptions<Value> {
  /** Toast shown while the promise is pending. It does not auto-dismiss. A string sets the description. */
  loading: string | ToastUpdateOptions;
  /** Toast shown when the promise resolves. A string sets the description. A function receives the resolved value. */
  success:
    | string
    | ToastUpdateOptions
    | ((result: Value) => string | ToastUpdateOptions);
  /** Toast shown when the promise rejects. A string sets the description. A function receives the rejection reason. */
  error:
    | string
    | ToastUpdateOptions
    | ((error: unknown) => string | ToastUpdateOptions);
}

function lift<O extends { leadingIcon?: ReactNode }>(options: O) {
  const { leadingIcon, ...rest } = options;
  // An explicit `leadingIcon: undefined` resets the toast to its type's default icon.
  if (!('leadingIcon' in options)) return rest;
  return { ...rest, data: { leadingIcon } };
}

/** Sets the placement options of a toast for the store it is in. */
type Place = (options: ToastUpdateOptions) => ToastUpdateOptions;

function liftDescriptor(option: string | ToastUpdateOptions, place: Place) {
  return typeof option === 'string' ? option : lift(place(option));
}

function liftCallable<Arg>(
  option:
    | string
    | ToastUpdateOptions
    | ((arg: Arg) => string | ToastUpdateOptions),
  place: Place
) {
  if (typeof option === 'function') {
    return (arg: Arg) => liftDescriptor(option(arg), place);
  }
  return liftDescriptor(option, place);
}

function liftPromiseOptions<Value>(
  { loading, success, error }: ToastPromiseOptions<Value>,
  place: Place
) {
  return {
    loading: liftDescriptor(loading, place),
    success: liftCallable(success, place),
    error: liftCallable(error, place)
  };
}

/** A toast with `positionerProps.anchor` shows next to that element. */
function isAnchored(options: ToastUpdateOptions) {
  return options.positionerProps?.anchor != null;
}

// A symbol key keeps the anchored manager out of the public API.
export const anchoredManager = Symbol('anchoredManager');

/**
 * Public toast manager. Mirrors the Base UI manager but exposes `leadingIcon`
 * as a first-class option on `add`/`update`/`promise`. All other Base UI
 * manager members are preserved.
 */
export interface ToastManager
  extends Omit<BaseManager, 'add' | 'update' | 'promise'> {
  /** Adds a toast and returns its id for `update` and `close`. */
  add: (options: ToastAddOptions) => string;
  /** Updates an open toast in place. Pass a function to build the update from the current toast. */
  update: (id: string, options: ToastUpdater) => void;
  /** Shows the `loading` toast, then updates it to `success` or `error` when the promise settles. Returns a promise that settles the same way. */
  promise: <Value>(
    promise: Promise<Value>,
    options: ToastPromiseOptions<Value>
  ) => Promise<Value>;
  /** Closes the toast with the given id, or every toast when you omit the id. */
  close: BaseManager['close'];
  /** @ignore */
  ' subscribe': BaseManager[' subscribe'];
  /**
   * Base UI renders anchored toasts in a separate provider, with this manager.
   * @ignore
   */
  [anchoredManager]: BaseManager;
}

// Base UI turns off swipe when `positionerProps.anchor` is set, even to `null`.
function unanchored<O extends ToastUpdateOptions>(options: O) {
  return { ...options, positionerProps: undefined };
}

// Base UI replaces `positionerProps` on update, which would drop `anchor`.
function keepPlacement(prev: ToastUpdateOptions['positionerProps']): Place {
  return options =>
    options.positionerProps
      ? { ...options, positionerProps: { ...prev, ...options.positionerProps } }
      : options;
}

type Methods = Pick<BaseManager, 'add' | 'close' | 'update' | 'promise'>;

// The toast's store is picked when it is created, and only `add` and `promise`
// know it. `close` and `update` go to both stores, which ignore unknown ids.
function route(
  stacked: Methods,
  anchored: Methods
): Pick<ToastManager, 'add' | 'close' | 'update' | 'promise'> {
  return {
    add: options =>
      isAnchored(options)
        ? anchored.add(lift(options))
        : stacked.add(lift(unanchored(options))),
    close: id => {
      stacked.close(id);
      anchored.close(id);
    },
    update: (id, updater) => {
      const resolve = (prev: ToastObject<ToastData>) =>
        typeof updater === 'function' ? updater(prev) : updater;
      stacked.update(id, prev => lift(unanchored(resolve(prev))));
      anchored.update(id, prev =>
        lift(keepPlacement(prev.positionerProps)(resolve(prev)))
      );
    },
    promise: (promise, options) => {
      const { loading } = options;
      return typeof loading !== 'string' && isAnchored(loading)
        ? anchored.promise(
            promise,
            liftPromiseOptions(options, keepPlacement(loading.positionerProps))
          )
        : stacked.promise(promise, liftPromiseOptions(options, unanchored));
    }
  };
}

export function createToastManager(): ToastManager {
  const stacked = ToastPrimitive.createToastManager<ToastData>();
  const anchored = ToastPrimitive.createToastManager<ToastData>();
  return {
    ...stacked,
    ...route(stacked, anchored),
    [anchoredManager]: anchored
  };
}

export const toastManager = createToastManager();

export const ToastManagerContext = createContext<ToastManager>(toastManager);

type BaseHookReturn = ReturnType<
  typeof ToastPrimitive.useToastManager<ToastData>
>;

/**
 * Reactive view of the active toast list plus the same `leadingIcon`-aware
 * `add`/`update`/`promise` API as the standalone manager. Must be used inside
 * `<Toast.Provider>`. The `toasts` list holds stacked toasts only.
 */
export interface UseToastManagerReturn
  extends Omit<BaseHookReturn, 'add' | 'update' | 'promise'> {
  /** Stacked toasts on screen. The hook re-renders when this list changes. */
  toasts: BaseHookReturn['toasts'];
  /** Adds a toast and returns its id for `update` and `close`. */
  add: ToastManager['add'];
  /** Updates an open toast in place. Pass a function to build the update from the current toast. */
  update: ToastManager['update'];
  /** Shows the `loading` toast, then updates it to `success` or `error` when the promise settles. Returns a promise that settles the same way. */
  promise: ToastManager['promise'];
  /** Closes the toast with the given id, or every toast when you omit the id. */
  close: BaseHookReturn['close'];
}

export function useToastManager(): UseToastManagerReturn {
  const { toasts, add, close, update, promise } =
    ToastPrimitive.useToastManager<ToastData>();
  const manager = useContext(ToastManagerContext);
  // Stacked toasts go straight into the store, so a toast added in a mount
  // effect shows even though the provider has not subscribed yet. The store
  // methods never change, so the routed methods stay the same as toasts change.
  const methods = useMemo(
    () => route({ add, close, update, promise }, manager[anchoredManager]),
    [add, close, update, promise, manager]
  );
  return useMemo(() => ({ toasts, ...methods }), [toasts, methods]);
}
