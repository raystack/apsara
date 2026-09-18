'use client';
import { IconButton, useTheme } from '@raystack/apsara';
import { Moon, Sun } from 'lucide-react';
import { type HTMLAttributes } from 'react';

export default function ThemeToggle(props: HTMLAttributes<HTMLElement>) {
  const { resolved, setValue } = useTheme();
  const isDark = resolved.appearance === 'dark';
  const Icon = isDark ? Moon : Sun;

  return (
    <IconButton
      aria-label='Toggle Theme'
      onClick={() => setValue({ appearance: isDark ? 'light' : 'dark' })}
      size={3}
      {...props}
    >
      <Icon />
    </IconButton>
  );
}
