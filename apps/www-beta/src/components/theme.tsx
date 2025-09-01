'use client';

import { ThemeProvider as ApsaraThemeProvider } from '@raystack/apsara';
import { useTheme as useNextTheme } from 'next-themes';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState
} from 'react';

type Theme = 'light' | 'dark';

export interface ThemeOptions {
  /** Style variant of the theme, either 'modern' or 'traditional' */
  style?: 'modern' | 'traditional';
  /** Accent color for the theme */
  accentColor?: 'indigo' | 'orange' | 'mint';
  /** Gray color variant for the theme */
  grayColor?: 'gray' | 'mauve' | 'slate';
  /** Theme value for light or dark  */
  theme?: Theme;
}

interface ThemeContextType extends ThemeOptions {
  setTheme: (options: ThemeOptions) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { resolvedTheme, setTheme } = useNextTheme();
  const theme = (resolvedTheme ?? 'light') as Theme;

  const [options, setOptions] = useState<ThemeOptions>({
    style: 'modern',
    accentColor: 'indigo',
    grayColor: 'gray'
  });

  const updateOptions = useCallback(
    (options: ThemeOptions) => {
      if ('theme' in options && options.theme) setTheme(options.theme);
      setOptions(_options => ({ ..._options, ...options }));
    },
    [setTheme]
  );

  const key = `${options?.accentColor}-${options?.grayColor}-${options?.style}`;
  return (
    <ThemeContext.Provider
      value={{ ...options, theme, setTheme: updateOptions }}
    >
      <ApsaraThemeProvider
        key={key}
        forcedTheme={theme}
        accentColor={options.accentColor}
        grayColor={options.grayColor}
        style={options.style}
      >
        {children}
      </ApsaraThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
