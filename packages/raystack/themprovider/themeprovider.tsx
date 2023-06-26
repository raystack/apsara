import React, { useContext } from "react";

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
type Theme = "dark" | "light";

function isValidTheme(theme: string): theme is Theme {
  return theme == "dark" || theme == "light";
}

type ThemeProviderType = {
  themeName: Theme;
  themePreference: ThemePreference;
  setTheme(newTheme: string): void;
};

const initialValues: ThemeProviderType = {
  themeName: defaultThemeName,
  themePreference: defaultThemeName,
  setTheme: () => {},
};

const ApsaraThemeContext = createContext<ThemeProviderType>(initialValues);
ApsaraThemeContext.displayName = "ApsaraThemeContext ";

const useTheme = (): ThemeProviderType => {
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

  listenForOSPreferenceChanges((osPref) => {
    if (osPref === osTheme) return;
    setOsTheme(osPref);
  });

  return {
    themeName,
    themePreference: themePreference,
    setTheme: (newTheme: ThemePreference) => {
      setThemePreference(newTheme);
      saveThemePreference(newTheme);
    },
  };
};

const ApsaraThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { themePreference, setTheme, themeName } = useTheme();
  return (
    <ApsaraThemeContext.Provider
      value={{
        themeName,
        themePreference,
        setTheme,
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

  const { themePreference, setTheme, themeName } = context;
  return { themePreference, setTheme, themeName };
}

export { ApsaraThemeContext, ApsaraThemeProvider };
