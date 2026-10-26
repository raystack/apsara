'use client';

import {
  type ToastManagerUpdateOptions,
  type ToastObject,
  Toast as ToastPrimitive
} from '@base-ui/react';
import { type ReactNode, useMemo } from 'react';

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

/** Public option shape: hides Base UI's internal storage slot and exposes `leadingIcon` directly. */
type WithModifiedOptions<T> = Omit<T, 'data'> & ToastData;

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
  loading: string | ToastUpdateOptions;
  success:
    | string
    | ToastUpdateOptions
    | ((result: Value) => string | ToastUpdateOptions);
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

function liftUpdater(updater: ToastUpdater) {
  if (typeof updater === 'function') {
    return (prevToast: ToastObject<ToastData>) => lift(updater(prevToast));
  }
  return lift(updater);
}

function liftDescriptor(option: string | ToastUpdateOptions) {
  return typeof option === 'string' ? option : lift(option);
}

function liftCallable<Arg>(
  option:
    | string
    | ToastUpdateOptions
    | ((arg: Arg) => string | ToastUpdateOptions)
) {
  if (typeof option === 'function') {
    return (arg: Arg) => liftDescriptor(option(arg));
  }
  return liftDescriptor(option);
}

function liftPromiseOptions<Value>({
  loading,
  success,
  error
}: ToastPromiseOptions<Value>) {
  return {
    loading: liftDescriptor(loading),
    success: liftCallable(success),
    error: liftCallable(error)
  };
}

/** A toast with `positionerProps.anchor` shows next to that element. */
function isAnchored(options: string | ToastUpdateOptions) {
  return typeof options !== 'string' && options.positionerProps?.anchor != null;
}

/**
 * Public toast manager. Mirrors the Base UI manager but exposes `leadingIcon`
 * as a first-class option on `add`/`update`/`promise`. All other Base UI
 * manager members are preserved.
 */
export interface ToastManager
  extends Omit<BaseManager, 'add' | 'update' | 'promise'> {
  add: (options: ToastAddOptions) => string;
  update: (id: string, options: ToastUpdater) => void;
  promise: <Value>(
    promise: Promise<Value>,
    options: ToastPromiseOptions<Value>
  ) => Promise<Value>;
}

// Base UI turns off swipe when `positionerProps.anchor` is set, even to `null`.
function unanchored<O extends ToastUpdateOptions>(options: O) {
  return { ...options, positionerProps: undefined };
}

type Methods = Pick<BaseManager, 'add' | 'close' | 'update' | 'promise'>;

// The toast's store is picked when it is created, and only `add` and `promise`
// know it. `close` and `update` go to both stores, which ignore unknown ids.
function wrap(
  stacked: Methods,
  anchored?: Methods
): Pick<ToastManager, 'add' | 'close' | 'update' | 'promise'> {
  return {
    add: options =>
      anchored && isAnchored(options)
        ? anchored.add(lift(options))
        : stacked.add(lift(unanchored(options))),
    close: id => {
      stacked.close(id);
      anchored?.close(id);
    },
    update: (id, options) => {
      stacked.update(id, liftUpdater(options));
      anchored?.update(id, liftUpdater(options));
    },
    promise: (promise, { loading, ...options }) =>
      anchored && isAnchored(loading)
        ? anchored.promise(promise, liftPromiseOptions({ ...options, loading }))
        : stacked.promise(
            promise,
            liftPromiseOptions({
              ...options,
              loading:
                typeof loading === 'string' ? loading : unanchored(loading)
            })
          )
  };
}

// Base UI renders anchored toasts in their own provider, so each manager
// keeps a second Base UI manager for them. `Toast.Provider` reads it here.
const anchoredManagers = new WeakMap<ToastManager, BaseManager>();

// `useToastManager` can only reach the stacked store, through Base UI's hook.
// `Toast.Provider` links that store's `add` to the anchored manager.
const anchoredByStore = new WeakMap<object, BaseManager>();

export function getAnchoredManager(manager: ToastManager) {
  return anchoredManagers.get(manager);
}

export function linkAnchoredManager(add: object, anchored?: BaseManager) {
  if (anchored) anchoredByStore.set(add, anchored);
}

export function createToastManager(): ToastManager {
  const stacked = ToastPrimitive.createToastManager<ToastData>();
  const anchored = ToastPrimitive.createToastManager<ToastData>();
  const manager = { ...stacked, ...wrap(stacked, anchored) };
  anchoredManagers.set(manager, anchored);
  return manager;
}

export const toastManager = createToastManager();

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
  add: ToastManager['add'];
  update: ToastManager['update'];
  promise: ToastManager['promise'];
}

export function useToastManager(): UseToastManagerReturn {
  const stacked = ToastPrimitive.useToastManager<ToastData>();
  return useMemo(
    () => ({ ...stacked, ...wrap(stacked, anchoredByStore.get(stacked.add)) }),
    [stacked]
  );
}
