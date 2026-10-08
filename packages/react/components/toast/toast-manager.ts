'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
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

/** Public option shape: hides Base UI's internal storage slot and exposes `leadingIcon` directly. */
type WithModifiedOptions<T> = Omit<T, 'data'> & ToastData;

export type ToastAddOptions = WithModifiedOptions<
  Parameters<BaseManager['add']>[0]
>;

export type ToastUpdateOptions = WithModifiedOptions<
  Parameters<BaseManager['update']>[1]
>;

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
  if (leadingIcon === undefined) return rest;
  return { ...rest, data: { leadingIcon } };
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
  update: (id: string, options: ToastUpdateOptions) => void;
  promise: <Value>(
    promise: Promise<Value>,
    options: ToastPromiseOptions<Value>
  ) => Promise<Value>;
}

// Base UI renders anchored toasts in their own provider, so each manager
// keeps a second Base UI manager for them. `Toast.Provider` reads it here.
const anchoredManagers = new WeakMap<ToastManager, BaseManager>();

export function getAnchoredManager(manager: ToastManager) {
  return anchoredManagers.get(manager);
}

export function createToastManager(): ToastManager {
  const base = ToastPrimitive.createToastManager<ToastData>();
  const anchored = ToastPrimitive.createToastManager<ToastData>();
  const manager: ToastManager = {
    ...base,
    add: options => (isAnchored(options) ? anchored : base).add(lift(options)),
    close: id => {
      base.close(id);
      anchored.close(id);
    },
    update: (id, options) => {
      base.update(id, lift(options));
      anchored.update(id, lift(options));
    },
    promise: (promise, options) =>
      (isAnchored(options.loading) ? anchored : base).promise(
        promise,
        liftPromiseOptions(options)
      )
  };
  anchoredManagers.set(manager, anchored);
  return manager;
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
  add: ToastManager['add'];
  update: ToastManager['update'];
  promise: ToastManager['promise'];
}

export function useToastManager(): UseToastManagerReturn {
  const base = ToastPrimitive.useToastManager<ToastData>();
  const manager = useContext(ToastManagerContext);
  return useMemo(() => {
    const anchored = getAnchoredManager(manager);
    return {
      ...base,
      add: options =>
        anchored && isAnchored(options)
          ? anchored.add(lift(options))
          : base.add(lift(options)),
      close: id => {
        base.close(id);
        anchored?.close(id);
      },
      update: (id, options) => {
        base.update(id, lift(options));
        anchored?.update(id, lift(options));
      },
      promise: (promise, options) =>
        anchored && isAnchored(options.loading)
          ? anchored.promise(promise, liftPromiseOptions(options))
          : base.promise(promise, liftPromiseOptions(options))
    };
  }, [base, manager]);
}
