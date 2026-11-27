'use client';

import {
  Avatar,
  Badge,
  Button,
  Field,
  Input,
  Progress,
  Switch,
  Tabs,
  Text
} from '@raystack/apsara';
import { Moon, Sun } from 'lucide-react';
import { type ReactNode } from 'react';
import { type ThemeOptions, useTheme } from '@/components/theme';
import styles from './landing.module.css';

type Accent = NonNullable<ThemeOptions['accentColor']>;
type Gray = NonNullable<ThemeOptions['grayColor']>;
type Style = NonNullable<ThemeOptions['style']>;

const ACCENTS: Accent[] = ['indigo', 'orange', 'mint'];
const GRAYS: Gray[] = ['gray', 'mauve', 'slate'];
const STYLES: Style[] = ['modern', 'traditional'];

type SegmentProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  renderOption?: (value: T) => ReactNode;
};

function Segment<T extends string>({
  label,
  value,
  options,
  onChange,
  renderOption
}: SegmentProps<T>) {
  return (
    <div className={styles.labGroup}>
      <div className={styles.labGroupHead}>
        <span className={styles.label}>{label}</span>
        <span className={styles.labValue}>{value}</span>
      </div>
      <div className={styles.segment} role='group' aria-label={label}>
        {options.map(option => (
          <button
            key={option}
            type='button'
            className={styles.segmentBtn}
            aria-pressed={option === value}
            onClick={() => onChange(option)}
          >
            {renderOption ? renderOption(option) : option}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The theme lab. The controls write to the same provider the whole site runs
 * on, so every specimen above and the drawing in the hero re-ink together —
 * there is no separate preview theme.
 */
export default function ThemeLab() {
  const { accentColor, grayColor, style, theme, setTheme } = useTheme();

  return (
    <div className={styles.lab}>
      <div className={styles.labControls}>
        <Segment<Accent>
          label='Accent'
          value={accentColor ?? 'indigo'}
          options={ACCENTS}
          onChange={accentColor => setTheme({ accentColor })}
          renderOption={value => (
            <>
              <span className={styles.swatch} data-accent={value} aria-hidden />
              {value}
            </>
          )}
        />
        <Segment<Gray>
          label='Gray'
          value={grayColor ?? 'gray'}
          options={GRAYS}
          onChange={grayColor => setTheme({ grayColor })}
        />
        <Segment<Style>
          label='Radius'
          value={style ?? 'modern'}
          options={STYLES}
          onChange={style => setTheme({ style })}
        />
        <Segment<'light' | 'dark'>
          label='Mode'
          value={theme ?? 'light'}
          options={['light', 'dark']}
          onChange={theme => setTheme({ theme })}
          renderOption={value => (
            <>
              {value === 'light' ? (
                <Sun size={12} strokeWidth={1.5} aria-hidden />
              ) : (
                <Moon size={12} strokeWidth={1.5} aria-hidden />
              )}
              {value}
            </>
          )}
        />
        <Text size='small' variant='tertiary' render={<p />}>
          Set once on ThemeProvider. Components read the tokens; nothing is
          hard-coded, so the choice carries to every surface in your app.
        </Text>
      </div>

      <div className={styles.labPreview}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div className={styles.row}>
              <Avatar size={4} fallback='HL' radius='full' />
              <div>
                <Text size='regular' weight='medium' render={<p />}>
                  Halcyon Labs
                </Text>
                <Text size='small' variant='secondary' render={<p />}>
                  Enterprise · 240 seats
                </Text>
              </div>
            </div>
            <Badge variant='success'>Active</Badge>
          </div>
          <div className={styles.cardBody}>
            <Tabs defaultValue='general' size='small'>
              <Tabs.List>
                <Tabs.Tab value='general'>General</Tabs.Tab>
                <Tabs.Tab value='access'>Access</Tabs.Tab>
                <Tabs.Tab value='billing'>Billing</Tabs.Tab>
              </Tabs.List>
            </Tabs>
            <Field label='Workspace name'>
              <Input required defaultValue='Halcyon Labs' />
            </Field>
            <div className={styles.fieldRow}>
              <div>
                <Text size='small' weight='medium' render={<p />}>
                  SSO enforcement
                </Text>
                <Text size='small' variant='secondary' render={<p />}>
                  Require SAML for every member.
                </Text>
              </div>
              <Switch defaultChecked size='small' />
            </div>
            <Progress value={82}>
              <Progress.Label>Seats in use</Progress.Label>
              <Progress.Value />
              <Progress.Track />
            </Progress>
          </div>
          <div className={styles.cardFoot}>
            <Button variant='outline' color='neutral' size='small'>
              Cancel
            </Button>
            <Button size='small'>Save changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
