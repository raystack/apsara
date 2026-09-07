'use client';

import { MoonIcon, SunIcon } from '~/icons';
import { IconButton } from '../icon-button';
import { useThemePreview } from './context';

export interface ThemePreviewSwitcherProps {
  /** Square size of the button box, in pixels. */
  size?: number;
  /** Whether to flip the root theme rather than the nearest scope. */
  target?: 'nearest' | 'root';
  'aria-label'?: string;
}

/**
 * Flips the appearance between light and dark. Reads `resolved.appearance`, so
 * `system` shows the icon for what is actually on screen.
 */
export function ThemePreviewSwitcher({
  size = 30,
  target = 'nearest',
  ...props
}: ThemePreviewSwitcherProps) {
  const theme = useThemePreview();
  const handle = target === 'root' ? theme.root : theme;
  const isDark = handle.resolved.appearance === 'dark';

  return (
    <IconButton
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => handle.setValue({ appearance: isDark ? 'light' : 'dark' })}
      style={{ width: size, height: size }}
      data-slot='theme-preview-switcher'
      {...props}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  );
}

ThemePreviewSwitcher.displayName = 'ThemePreviewSwitcher';
