'use client';
import { useTheme } from '@/components/theme';
import { IconButton } from '@raystack/apsara';
import { Moon, Sun } from 'lucide-react';
import { type HTMLAttributes } from 'react';

const ICONS_MAP = { light: Sun, dark: Moon } as const;

export default function ThemeToggle(props: HTMLAttributes<HTMLElement>) {
  const { setTheme, theme } = useTheme();
  const Icon = ICONS_MAP[theme as keyof typeof ICONS_MAP];

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
