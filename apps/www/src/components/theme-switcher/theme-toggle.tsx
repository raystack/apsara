'use client';
import { IconButton } from '@raystack/apsara';
import { Moon, Sun } from 'lucide-react';
import { type HTMLAttributes } from 'react';
import { useTheme } from '@/components/theme';

const ICONS_MAP = { light: Sun, dark: Moon } as const;

export default function ThemeToggle(props: HTMLAttributes<HTMLElement>) {
  const { setTheme, theme } = useTheme();
  // `theme` can briefly be undefined or an unexpected value during hydration
  // (next-themes resolves async). Fall back so rendering doesn't crash.
  const Icon = ICONS_MAP[theme as keyof typeof ICONS_MAP] ?? Sun;

  return (
    <IconButton
      aria-label='Toggle Theme'
      onClick={() => setTheme({ theme: theme === 'light' ? 'dark' : 'light' })}
      size={3}
      {...props}
    >
      <Icon />
    </IconButton>
  );
}
