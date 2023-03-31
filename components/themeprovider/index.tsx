import React, { useContext } from "react";

import { dark, theme as light } from "~/stitches.config";
import { getMediaTheme, listenForOSPreferenceChanges, MediaTheme } from "./OSPreference";
import { getSavedThemePreference, isValidThemePreference, saveThemePreference, ThemePreference } from "./storage";
const { createContext, useState, useEffect } = React;

const defaultThemeName = "dark";
const defaultTheme = dark;

type Theme = "dark" | "light";

type ThemeProviderType = {
    themePreference: ThemePreference;
    theme: Theme;
    stitchesTheme: AvailableThemes[string];
    setTheme(newTheme: string): void;
};

const initialValues: ThemeProviderType = {
    themePreference: defaultThemeName,
    theme: defaultThemeName,
    stitchesTheme: defaultTheme,
    setTheme: () => {},
};

const ApsaraThemeContext = createContext<ThemeProviderType>(initialValues);
ApsaraThemeContext.displayName = "ApsaraThemeContext ";

type AvailableThemes = {
    [x: string]: typeof light | typeof dark;
};

const available_themes: AvailableThemes = {
    dark: dark,
    light: light,
};

export type StitchesTheme = AvailableThemes[string];
const useTheme = (): ThemeProviderType => {
    const [themePreference, setThemePreference] = useState<ThemePreference>(defaultThemeName);
    const [theme, setTheme] = useState<Theme>(defaultThemeName);
    const [stitchesTheme, setStitchesTheme] = useState<AvailableThemes[string]>(defaultTheme);
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
            setTheme(osTheme ?? defaultThemeName);
        } else {
            setTheme(themePreference);
        }
    }, [themePreference]);

    useEffect(() => {
        // if os theme changes and we are in auto mode, change up
        if (themePreference == "auto") {
            setTheme(osTheme ?? defaultThemeName);
        }
    }, [osTheme]);

    useEffect(() => {
        const html = document.documentElement;
        for (const k of Object.values(available_themes)) {
            html.classList.remove(k);
        }
        html.classList.add(available_themes[theme]);
        setStitchesTheme(available_themes[theme]);
    }, [theme]);

    listenForOSPreferenceChanges((osPref) => {
        if (osPref === osTheme) return;
        setOsTheme(osPref);
    });

    return {
        themePreference: themePreference,
        theme,
        stitchesTheme,
        setTheme: (newTheme: ThemePreference) => {
            setThemePreference(newTheme);
            saveThemePreference(newTheme);
        },
    };
};

const ApsaraThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { themePreference, setTheme, stitchesTheme, theme } = useTheme();
    return (
        <ApsaraThemeContext.Provider
            value={{
                theme,
                themePreference: themePreference,
                stitchesTheme,
                setTheme: setTheme,
            }}
        >
            {children}
        </ApsaraThemeContext.Provider>
    );
};

export function useApsaraTheme() {
    const context = useContext(ApsaraThemeContext);

    if (!context) {
        throw new Error("[Apsara UI 2.0]: useApsaraTheme must be used within a ApsaraThemeProvider");
    }

    const { themePreference, setTheme, stitchesTheme, theme } = context;
    return { themePreference, setTheme, stitchesTheme, theme };
}

export { ApsaraThemeContext, ApsaraThemeProvider };
