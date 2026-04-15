import { useContext } from 'react';
import { FieldContext, FieldContextValue } from './field-root';

// This is a separate file to keep the hook server safe.
// The hook always returns the same number of calls on the client,
// and zero calls on the server, which is safe because server renders
// are never interleaved with client renders.
export function useFieldContext(): FieldContextValue | null | undefined {
  if (typeof document === 'undefined') return undefined;
  // biome-ignore lint/correctness/useHookAtTopLevel: server/client renders never interleave, hook count is consistent per environment
  return useContext(FieldContext);
}
