'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState
} from 'react';
import { useIsomorphicLayoutEffect } from '~/hooks/useIsomorphicLayoutEffect';

/*
 * Counts the items a list renders. Lists that filter their own children
 * (instead of using Base UI's `items` prop) use the count to know when nothing
 * matches and how many results to announce.
 */

type RegisterItem = () => () => void;

const RegisterItemContext = createContext<RegisterItem | null>(null);
const ItemCountContext = createContext<number | null>(null);

export function ItemCountProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const register = useCallback<RegisterItem>(() => {
    setCount(value => value + 1);
    return () => setCount(value => value - 1);
  }, []);

  return (
    <RegisterItemContext value={register}>
      <ItemCountContext value={count}>{children}</ItemCountContext>
    </RegisterItemContext>
  );
}

/** Adds the calling item to the nearest count while `enabled` is true. */
export function useRegisterItem(enabled = true) {
  const register = useContext(RegisterItemContext);

  useIsomorphicLayoutEffect(() => {
    if (!enabled || !register) return;
    return register();
  }, [enabled, register]);
}

/** The number of registered items, or `null` outside a provider. */
export function useItemCount() {
  return useContext(ItemCountContext);
}
