'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
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

export function createToastManager(): ToastManager {
  const base = ToastPrimitive.createToastManager<ToastData>();
  return {
    ...base,
    add: options => base.add(lift(options)),
    update: (id, options) => base.update(id, lift(options)),
    promise: (promise, options) =>
      base.promise(promise, liftPromiseOptions(options))
  };
}

export const toastManager = createToastManager();

type BaseHookReturn = ReturnType<
  typeof ToastPrimitive.useToastManager<ToastData>
>;

/**
 * Reactive view of the active toast list plus the same `leadingIcon`-aware
 * `add`/`update`/`promise` API as the standalone manager. Must be used inside
 * `<Toast.Provider>`.
 */
export interface UseToastManagerReturn
  extends Omit<BaseHookReturn, 'add' | 'update' | 'promise'> {
  add: ToastManager['add'];
  update: ToastManager['update'];
  promise: ToastManager['promise'];
}

export function useToastManager(): UseToastManagerReturn {
  const base = ToastPrimitive.useToastManager<ToastData>();
  return useMemo(
    () => ({
      ...base,
      add: options => base.add(lift(options)),
      update: (id, options) => base.update(id, lift(options)),
      promise: (promise, options) =>
        base.promise(promise, liftPromiseOptions(options))
    }),
    [base]
  );
}
