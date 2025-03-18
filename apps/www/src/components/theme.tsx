"use client";
import { createContext, useContext, ReactNode, useState } from "react";
import { ThemeProvider as ApsaraThemeProvider } from "@raystack/apsara/v1";
import { useTheme as useNextTheme } from "next-themes";

type Theme = "light" | "dark";
type AccentColor = "indigo" | "mint" | "orange";

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { resolvedTheme, setTheme } = useNextTheme();
  const theme = (resolvedTheme ?? "light") as Theme;
  const [accentColor, setAccentColor] = useState<AccentColor>("indigo");

  return (
    <ThemeContext.Provider
      value={{ theme, accentColor, setTheme, setAccentColor }}>
      <ApsaraThemeProvider
        accentColor={accentColor}
        forcedTheme={theme}
        key={accentColor}>
        {children}
      </ApsaraThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
