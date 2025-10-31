import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

export interface UseDebouncedStateOptions {
  leading?: boolean;
}

export type UseDebouncedStateReturnValue<T> = [
  T,
  (newValue: SetStateAction<T>) => void
];

/**
 * A hook that debounces the state update.
 * @param defaultValue - The default value of the state.
 * @param delay - The delay time in milliseconds.
 * @param options - The options for the hook.
 * @returns A tuple containing the current value and the debounced set value function.
 *
 * @example
 * const [value, setValue] = useDebouncedState('Hello', 1000);

 * @example
 * const [value, setValue] = useDebouncedState('Hello', 1000, { leading: true });
 */
export function useDebouncedState<T = any>(
  defaultValue: T,
  delay: number,
  options: UseDebouncedStateOptions = { leading: false }
): UseDebouncedStateReturnValue<T> {
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef<number | null>(null);
  const leadingRef = useRef(true);

  const clearTimeout = useCallback(
    () => window.clearTimeout(timeoutRef.current!),
    []
  );
  useEffect(() => clearTimeout, [clearTimeout]);

  const debouncedSetValue = useCallback(
    (newValue: SetStateAction<T>) => {
      clearTimeout();
      if (leadingRef.current && options.leading) {
        setValue(newValue);
      } else {
        timeoutRef.current = window.setTimeout(() => {
          leadingRef.current = true;
          setValue(newValue);
        }, delay);
      }
      leadingRef.current = false;
    },
    [options.leading, clearTimeout, delay]
  );

  return [value, debouncedSetValue] as const;
}
