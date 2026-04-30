'use client';

import { mergeProps, useRender } from '@base-ui/react';
import type {
  AccentColor,
  ColorScheme,
  GrayColor,
  StyleVariant
} from './types';

export interface ThemeScopeProps extends useRender.ComponentProps<'div'> {
  /** Color scheme for this subtree. Sets `data-theme`; native UI (form
   *  controls, scrollbars) follows via the package's `color-scheme` rule. */
  theme?: ColorScheme;
  /** Accent color for this subtree. Sets `data-accent-color`. */
  accentColor?: AccentColor;
  /** Gray variant for this subtree. Sets `data-gray-color`. */
  grayColor?: GrayColor;
  /** Style variant for this subtree. Sets `data-style`. */
  styleVariant?: StyleVariant;
}

export function ThemeScope({
  theme,
  accentColor,
  grayColor,
  styleVariant,
  render,
  ref,
  ...props
}: ThemeScopeProps) {
  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        'data-theme': theme,
        'data-accent-color': accentColor,
        'data-gray-color': grayColor,
        'data-style': styleVariant
      } as useRender.ComponentProps<'div'>,
      props
    )
  });
}

ThemeScope.displayName = 'ThemeScope';
