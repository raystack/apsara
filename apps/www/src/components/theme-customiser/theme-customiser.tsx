'use client';
import { Button, Label, Radio, Tabs } from '@raystack/apsara';
import { getPropsString } from '@/lib/utils';
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
    const themeString: string = `<Theme${getPropsString(props)}>`;

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
            <Tabs.Tab value='modern'>Modern</Tabs.Tab>
            <Tabs.Tab value='traditional'>Traditional</Tabs.Tab>
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
            <Tabs.Tab value='light'>Light</Tabs.Tab>
            <Tabs.Tab value='dark'>Dark</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Accent Color</h3>
        <Radio.Group
          value={accentColor}
          onValueChange={value =>
            setTheme({
              accentColor: value as ThemeOptions['accentColor']
            })
          }
        >
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <Radio value='indigo' id='accent-indigo' />
              <Label className={styles.radioLabel} htmlFor='accent-indigo'>
                Indigo
              </Label>
            </div>
            <div className={styles.radioOption}>
              <Radio value='orange' id='accent-orange' />
              <Label className={styles.radioLabel} htmlFor='accent-orange'>
                Orange
              </Label>
            </div>
            <div className={styles.radioOption}>
              <Radio value='mint' id='accent-mint' />
              <Label className={styles.radioLabel} htmlFor='accent-mint'>
                Mint
              </Label>
            </div>
          </div>
        </Radio.Group>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Gray Color</h3>
        <Radio.Group
          value={grayColor}
          onValueChange={value =>
            setTheme({ grayColor: value as ThemeOptions['grayColor'] })
          }
        >
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <Radio value='gray' id='gray-gray' />
              <Label className={styles.radioLabel} htmlFor='gray-gray'>
                Gray
              </Label>
            </div>
            <div className={styles.radioOption}>
              <Radio value='mauve' id='gray-mauve' />
              <Label className={styles.radioLabel} htmlFor='gray-mauve'>
                Mauve
              </Label>
            </div>
            <div className={styles.radioOption}>
              <Radio value='slate' id='gray-slate' />
              <Label className={styles.radioLabel} htmlFor='gray-slate'>
                Slate
              </Label>
            </div>
          </div>
        </Radio.Group>
      </div>
      <Button onClick={handleCopyTheme} type='button' style={{ width: '100%' }}>
        Copy Theme Options
      </Button>
    </div>
  );
}
