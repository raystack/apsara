'use client';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

import { IconButton } from '../icon-button';
import { useTheme } from './theme';

enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

type Props = { size?: number };

export function ThemeSwitcher({ size = 30, ...props }: Props) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === Theme.DARK;

  const onClickHandler = () => {
    setTheme(isDark ? Theme.LIGHT : Theme.DARK);
  };

  return (
    <IconButton
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={onClickHandler}
      style={{ width: size, height: size }}
      {...props}
    >
      {isDark ? (
        <SunIcon width={size} height={size} />
      ) : (
        <MoonIcon width={size} height={size} />
      )}
    </IconButton>
  );
}

ThemeSwitcher.displayName = 'ThemeSwitcher';
