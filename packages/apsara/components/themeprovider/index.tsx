import React, { useContext } from "react";

// default themes - {light & dark}
import { dark, theme as light } from "../../stitches.config";
import {
  getMediaTheme,
  listenForOSPreferenceChanges,
  MediaTheme,
} from "./OSPreference";
import {
  getSavedThemePreference,
  isValidThemePreference,
  saveThemePreference,
  ThemePreference,
} from "./storage";
const { createContext, useState, useEffect } = React;

const defaultThemeName = "light";
const defaultTheme = light;

type Theme = "dark" | "light";
type AvailableThemes = {
  [x: string]: typeof light | typeof dark;
};

function isValidTheme(theme: string): theme is Theme {
  return theme == "dark" || theme == "light";
}

const available_themes: AvailableThemes = {
  dark: dark,
  light: light,
};

type ThemeProviderType = {
  themes: AvailableThemes;
  theme: AvailableThemes[string];
  themeName: Theme;
  themePreference: ThemePreference;
  setTheme(newTheme: string): void;
  updateTheme(name: string, theme: AvailableThemes[string]): void;
};

const initialValues: ThemeProviderType = {
  themes: {},
  theme: defaultTheme,
  themeName: defaultThemeName,
  themePreference: defaultThemeName,
  setTheme: () => {},
  updateTheme: () => {},
};

const ApsaraThemeContext = createContext<ThemeProviderType>(initialValues);
ApsaraThemeContext.displayName = "ApsaraThemeContext ";

export type StitchesTheme = AvailableThemes[string];
const useTheme = (): ThemeProviderType => {
  const [themes, setThemes] = useState<AvailableThemes>({
    ...available_themes,
  });
  const [theme, setTheme] = useState<AvailableThemes[string]>(defaultTheme);
  const [themePreference, setThemePreference] =
    useState<ThemePreference>(defaultThemeName);
  const [themeName, setThemeName] = useState<Theme>(defaultThemeName);
  const [osTheme, setOsTheme] = useState<MediaTheme | null>(getMediaTheme());

  // in the future this should prefer auto if no saved
  useEffect(() => {
    const initialTheme = getSavedThemePreference();
    if (isValidThemePreference(initialTheme)) {
      setThemePreference(initialTheme);
    } else {
      setThemePreference(defaultThemeName);
    }
  }, []);

  useEffect(() => {
    if (themePreference == "auto") {
      setThemeName(osTheme ?? defaultThemeName);
    } else {
      setThemeName(themePreference);
    }
  }, [themePreference]);

  useEffect(() => {
    // if os theme changes and we are in auto mode, change up
    if (themePreference == "auto") {
      setThemeName(osTheme ?? defaultThemeName);
    }
  }, [osTheme]);

  useEffect(() => {
    const html = document.documentElement;
    for (const k of Object.values(themes)) {
      html.classList.remove(k);
    }
    html.classList.add(themes[themeName]);
    setTheme(themes[themeName]);
  }, [themeName, themes]);

  listenForOSPreferenceChanges((osPref) => {
    if (osPref === osTheme) return;
    setOsTheme(osPref);
  });

  return {
    theme,
    themes,
    themeName,
    themePreference: themePreference,
    setTheme: (newTheme: ThemePreference) => {
      setThemePreference(newTheme);
      saveThemePreference(newTheme);
    },
    updateTheme: (theme: Theme, value: AvailableThemes[string]) => {
      if (isValidTheme(theme)) {
        setThemes({
          ...themes,
          [theme]: value,
        });
      }
    },
  };
};

const ApsaraThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { themePreference, setTheme, themeName, theme, themes, updateTheme } =
    useTheme();
  return (
    <ApsaraThemeContext.Provider
      value={{
        theme,
        themes,
        themeName,
        themePreference,
        setTheme,
        updateTheme,
      }}
    >
      {children}
    </ApsaraThemeContext.Provider>
  );
};

export function useApsaraTheme() {
  const context = useContext(ApsaraThemeContext);

  if (!context) {
    throw new Error(
      "[Apsara UI 2.0]: useApsaraTheme must be used within a ApsaraThemeProvider"
    );
  }

  const { themePreference, setTheme, updateTheme, themeName, theme, themes } =
    context;
  return { themePreference, setTheme, updateTheme, themeName, theme, themes };
}

export { ThemeSwitcher } from "./switcher";
export { ApsaraThemeContext, ApsaraThemeProvider };
