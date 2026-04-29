'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
import type { ReactNode } from 'react';

export interface ToastData {
  leadingIcon?: ReactNode;
}

type BaseManager = ReturnType<
  typeof ToastPrimitive.createToastManager<ToastData>
>;
type BaseAddOptions = Parameters<BaseManager['add']>[0];
type BaseUpdateOptions = Parameters<BaseManager['update']>[1];

export type ToastAddOptions = Omit<BaseAddOptions, 'data'> & {
  /**
   * Icon rendered before the toast title. Inherits color from the toast type
   * (e.g. green for `type: "success"`).
   */
  leadingIcon?: ReactNode;
};

export type ToastUpdateOptions = Omit<BaseUpdateOptions, 'data'> & {
  leadingIcon?: ReactNode;
};

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

export interface ToastManager {
  add: (options: ToastAddOptions) => string;
  close: (id?: string) => void;
  update: (id: string, options: ToastUpdateOptions) => void;
  promise: <Value>(
    promise: Promise<Value>,
    options: ToastPromiseOptions<Value>
  ) => Promise<Value>;
}

/**
 * Internal map from public ToastManager wrappers to the underlying Base UI
 * manager. Used by `ToastProvider` to forward the correct instance to
 * `ToastPrimitive.Provider`.
 */
export const _baseManagerRef = new WeakMap<ToastManager, BaseManager>();

function lift<O extends { leadingIcon?: ReactNode }>(options: O) {
  const { leadingIcon, ...rest } = options;
  if (leadingIcon === undefined) return rest;
  return { ...rest, data: { leadingIcon } };
}

function liftPromiseOption<O extends { leadingIcon?: ReactNode }, A>(
  option: string | O | ((arg: A) => string | O)
) {
  if (typeof option === 'string') return option;
  if (typeof option === 'function') {
    const fn = option as (arg: A) => string | O;
    return (arg: A) => {
      const result = fn(arg);
      return typeof result === 'string' ? result : lift(result);
    };
  }
  return lift(option);
}

export function createToastManager(): ToastManager {
  const base = ToastPrimitive.createToastManager<ToastData>();
  const wrapper: ToastManager = {
    add: options => base.add(lift(options) as BaseAddOptions),
    close: id => base.close(id),
    update: (id, options) =>
      base.update(id, lift(options) as BaseUpdateOptions),
    promise: (promise, { loading, success, error }) =>
      base.promise(promise, {
        // biome-ignore lint/suspicious/noExplicitAny: Base UI accepts these shapes via union
        loading: liftPromiseOption(loading) as any,
        // biome-ignore lint/suspicious/noExplicitAny: Base UI accepts these shapes via union
        success: liftPromiseOption(success) as any,
        // biome-ignore lint/suspicious/noExplicitAny: Base UI accepts these shapes via union
        error: liftPromiseOption(error) as any
      })
  };
  _baseManagerRef.set(wrapper, base);
  return wrapper;
}

export const toastManager = createToastManager();
