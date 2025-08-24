'use client';
import { getPropsString } from '@/lib/utils';
import { Button, Radio, Tabs } from '@raystack/apsara';
import { ThemeOptions, useTheme } from '../theme';
import styles from './theme-customiser.module.css';

const DEFAULT_OPTIONS: ThemeOptions = {
  style: 'modern',
  accentColor: 'indigo',
  grayColor: 'gray'
};

export default function ThemeCustomizer() {
  const {
    style = DEFAULT_OPTIONS.style,
    accentColor = DEFAULT_OPTIONS.accentColor,
    grayColor = DEFAULT_OPTIONS.grayColor,
    theme,
    setTheme
  } = useTheme();

  const options = { style, accentColor, grayColor };

  const handleCopyTheme = () => {
    const props = Object.fromEntries(
      Object.entries(options).filter(
        ([key, value]) => DEFAULT_OPTIONS[key as keyof ThemeOptions] !== value
      )
    );
    const themeString: string = `<ThemeProvider${getPropsString(props)}>`;

    navigator.clipboard.writeText(themeString);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Theme</h2>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Style</h3>
        <Tabs
          value={style}
          onValueChange={value =>
            setTheme({ style: value as ThemeOptions['style'] })
          }
        >
          <Tabs.List>
            <Tabs.Trigger value='modern'>Modern</Tabs.Trigger>
            <Tabs.Trigger value='traditional'>Traditional</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Appearance</h3>
        <Tabs
          value={theme}
          onValueChange={value =>
            setTheme({ theme: value as ThemeOptions['theme'] })
          }
        >
          <Tabs.List>
            <Tabs.Trigger value='light'>Light</Tabs.Trigger>
            <Tabs.Trigger value='dark'>Dark</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Accent Color</h3>
        <Radio
          value={accentColor}
          onValueChange={value =>
            setTheme({
              accentColor: value as ThemeOptions['accentColor']
            })
          }
        >
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <Radio.Item value='indigo' id='accent-indigo' />
              <label className={styles.radioLabel} htmlFor='accent-indigo'>
                Indigo
              </label>
            </div>
            <div className={styles.radioOption}>
              <Radio.Item value='orange' id='accent-orange' />
              <label className={styles.radioLabel} htmlFor='accent-orange'>
                Orange
              </label>
            </div>
            <div className={styles.radioOption}>
              <Radio.Item value='mint' id='accent-mint' />
              <label className={styles.radioLabel} htmlFor='accent-mint'>
                Mint
              </label>
            </div>
          </div>
        </Radio>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Gray Color</h3>
        <Radio
          value={grayColor}
          onValueChange={value =>
            setTheme({ grayColor: value as ThemeOptions['grayColor'] })
          }
        >
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <Radio.Item value='gray' id='gray-gray' />
              <label className={styles.radioLabel} htmlFor='gray-gray'>
                Gray
              </label>
            </div>
            <div className={styles.radioOption}>
              <Radio.Item value='mauve' id='gray-mauve' />
              <label className={styles.radioLabel} htmlFor='gray-mauve'>
                Mauve
              </label>
            </div>
            <div className={styles.radioOption}>
              <Radio.Item value='slate' id='gray-slate' />
              <label className={styles.radioLabel} htmlFor='gray-slate'>
                Slate
              </label>
            </div>
          </div>
        </Radio>
      </div>
      <Button onClick={handleCopyTheme} type='button' width='100%'>
        Copy Theme Options
      </Button>
    </div>
  );
}
