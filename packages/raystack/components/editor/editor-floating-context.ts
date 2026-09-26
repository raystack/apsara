'use client';

import { createContext, useContext, useEffect } from 'react';

export interface FloatingToolbarContextValue {
  visible: boolean;
  /** Swaps the buttons for the link field. */
  openLink: () => void;
  closeLink: () => void;
  /** Keeps the toolbar open while a menu from it is open. Returns the release. */
  hold: () => () => void;
}

export const FloatingToolbarContext =
  createContext<FloatingToolbarContextValue | null>(null);

/** The floating toolbar around a control, or null inside a fixed toolbar. */
export function useFloatingToolbar(): FloatingToolbarContextValue | null {
  return useContext(FloatingToolbarContext);
}

/** Holds the floating toolbar open while `open` is true. */
export function useHoldFloatingToolbar(open: boolean): void {
  const floating = useFloatingToolbar();
  const hold = floating?.hold;
  useEffect(() => {
    if (!open || !hold) return;
    return hold();
  }, [open, hold]);
}
