'use client';

import { useSyncExternalStore } from 'react';

import { type Appearance, SYSTEM_APPEARANCE_QUERY } from './settings';

function noop(): void {
  /* nothing to clean up */
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return noop;
  const query = window.matchMedia(SYSTEM_APPEARANCE_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getSnapshot(): Appearance {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia(SYSTEM_APPEARANCE_QUERY).matches ? 'dark' : 'light';
}

/** Matches the attribute the server writes for `appearance: 'system'`. */
function getServerSnapshot(): Appearance {
  return 'light';
}

/** What the OS reports, whatever the current setting is. */
export function useSystemAppearance(): Appearance {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
