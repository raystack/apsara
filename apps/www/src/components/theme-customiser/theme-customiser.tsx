"use client";
import { Tabs, Radio, Button } from "@raystack/apsara/v1";
import styles from "./theme-customiser.module.css";
import { getPropsString } from "@/lib/utils";

export interface ThemeOptions {
  /** Style variant of the theme, either 'modern' or 'traditional' */
  style?: "modern" | "traditional";
  /** Accent color for the theme */
  accentColor?: "indigo" | "orange" | "mint";
  /** Gray color variant for the theme */
  grayColor?: "gray" | "mauve" | "slate";
}

interface ThemeCustomizerProps {
  theme: ThemeOptions;
  onThemeChange?: (theme: ThemeOptions) => void;
}

const DEFAULT_OPTIONS: ThemeOptions = {
  style: "modern",
  accentColor: "indigo",
  grayColor: "gray",
};

export default function ThemeCustomizer({
  theme,
  onThemeChange,
}: ThemeCustomizerProps) {
  const {
    style = DEFAULT_OPTIONS.style,
    accentColor = DEFAULT_OPTIONS.accentColor,
    grayColor = DEFAULT_OPTIONS.grayColor,
  } = theme;

  const handleChange = (value: Partial<ThemeOptions>) => {
    onThemeChange?.(value);
  };

  const handleCopyTheme = () => {
    const props = Object.fromEntries(
      Object.entries(theme).filter(
        ([key, value]) => DEFAULT_OPTIONS[key as keyof ThemeOptions] !== value,
      ),
    );
    const themeString: string = `<ThemeProvider${getPropsString(props)}>`;

    navigator.clipboard.writeText(themeString);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Theme</h2>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Style</h3>
        <Tabs.Root
          value={style}
          onValueChange={value =>
            handleChange({ style: value as ThemeOptions["style"] })
          }>
          <Tabs.List>
            <Tabs.Trigger value="modern">Modern</Tabs.Trigger>
            <Tabs.Trigger value="traditional">Traditional</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Accent Color</h3>
        <Radio.Root
          value={accentColor}
          onValueChange={value =>
            handleChange({
              accentColor: value as ThemeOptions["accentColor"],
            })
          }>
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <Radio.Item value="indigo" id="accent-indigo" />
              <label className={styles.radioLabel} htmlFor="accent-indigo">
                Indigo
              </label>
            </div>
            <div className={styles.radioOption}>
              <Radio.Item value="orange" id="accent-orange" />
              <label className={styles.radioLabel} htmlFor="accent-orange">
                Orange
              </label>
            </div>
            <div className={styles.radioOption}>
              <Radio.Item value="mint" id="accent-mint" />
              <label className={styles.radioLabel} htmlFor="accent-mint">
                Mint
              </label>
            </div>
          </div>
        </Radio.Root>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Gray Color</h3>
        <Radio.Root
          value={grayColor}
          onValueChange={value =>
            handleChange({ grayColor: value as ThemeOptions["grayColor"] })
          }>
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <Radio.Item value="gray" id="gray-gray" />
              <label className={styles.radioLabel} htmlFor="gray-gray">
                Gray
              </label>
            </div>
            <div className={styles.radioOption}>
              <Radio.Item value="mauve" id="gray-mauve" />
              <label className={styles.radioLabel} htmlFor="gray-mauve">
                Mauve
              </label>
            </div>
            <div className={styles.radioOption}>
              <Radio.Item value="slate" id="gray-slate" />
              <label className={styles.radioLabel} htmlFor="gray-slate">
                Slate
              </label>
            </div>
          </div>
        </Radio.Root>
      </div>
      <Button onClick={handleCopyTheme} type="button" width="100%">
        Copy Theme Options
      </Button>
    </div>
  );
}
