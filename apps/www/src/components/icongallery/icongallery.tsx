'use client';

import * as Apsara from '@raystack/apsara';
import {
  type ComponentType,
  type CSSProperties,
  type SVGProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import styles from './icongallery.module.css';

// Built from plain elements rather than Apsara components on purpose: the grid is
// the thing being documented, so its own chrome should not compete with it. The
// two glyphs below are inlined for the same reason — an Apsara icon here would
// inherit the customizer variables and resize with the grid.

type IconEntry = {
  name: string;
  /** The name with every separator stripped, so "chevron down" also matches. */
  term: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Every registry wrapper, read off the package barrel. `createIcon` sets
 * `displayName` to the icon name, so that test picks out the icons and leaves
 * `IconButton`, `IconProvider`, and the rest alone. Reading the barrel means the
 * gallery never drifts from `icon-map.json`.
 */
const ICONS: IconEntry[] = Object.entries(
  Apsara as unknown as Record<string, unknown>
)
  .filter(
    ([name, value]) =>
      name.endsWith('Icon') &&
      typeof value === 'function' &&
      (value as { displayName?: string }).displayName === name
  )
  .map(([name, value]) => ({
    name,
    term: normalize(name.replace(/Icon$/, '')),
    Icon: value as ComponentType<SVGProps<SVGSVGElement>>
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

/** The values `createIcon` applies, so a reset returns the real defaults. */
const DEFAULT_STROKE = 1.5;
const DEFAULT_SIZE = 16;
const HEX = /^#[0-9a-f]{6}$/i;

const STROKE_MIN = 0.5;
const STROKE_MAX = 3;
const SIZE_MIN = 12;
const SIZE_MAX = 48;

/** Trims a trailing `.00` / `.50` so 1.5 reads as "1.5" and 2 as "2". */
const trim = (value: number) => String(Number(value.toFixed(2)));

const percent = (value: number, min: number, max: number) =>
  `${((value - min) / (max - min)) * 100}%`;

function SearchGlyph() {
  return (
    <svg
      className={styles.glyph}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <circle cx='11' cy='11' r='8' />
      <path d='m21 21-4.3-4.3' />
    </svg>
  );
}

function ResetGlyph() {
  return (
    <svg
      className={styles.glyph}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.36 2.64L3 8' />
      <path d='M3 3v5h5' />
    </svg>
  );
}

export function IconGallery() {
  const [query, setQuery] = useState('');
  const [stroke, setStroke] = useState(DEFAULT_STROKE);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [color, setColor] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback((name: string) => {
    navigator.clipboard?.writeText(name);
    setCopied(name);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(null), 1600);
  }, []);

  const matches = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return ICONS;
    return ICONS.filter(icon => icon.term.includes(needle));
  }, [query]);

  // An incomplete hex is left unapplied rather than clearing the colour on every
  // keystroke. Empty means "inherit", which is what keeps dark mode working.
  const appliedColor = HEX.test(color) ? color : '';
  const isDefault =
    stroke === DEFAULT_STROKE && size === DEFAULT_SIZE && color === '';

  const reset = () => {
    setStroke(DEFAULT_STROKE);
    setSize(DEFAULT_SIZE);
    setColor('');
  };

  return (
    <div className={styles.root}>
      <div className={styles.searchField}>
        <span className={styles.searchIcon}>
          <SearchGlyph />
        </span>
        <input
          className={styles.searchInput}
          type='search'
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={`Search ${ICONS.length} icons…`}
          aria-label='Search icons'
          spellCheck={false}
          autoComplete='off'
        />
      </div>

      <section className={styles.customizer} aria-labelledby='ig-customizer'>
        <div className={styles.customizerHead}>
          <h3 className={styles.customizerTitle} id='ig-customizer'>
            Customizer
          </h3>
          <button
            type='button'
            className={styles.reset}
            onClick={reset}
            disabled={isDefault}
            title='Reset to the Apsara defaults'
            aria-label='Reset to the Apsara defaults'
          >
            <ResetGlyph />
          </button>
        </div>

        <div className={styles.controls}>
          <div className={styles.control}>
            <div className={styles.controlHead}>
              <label className={styles.label} htmlFor='ig-color'>
                Color
              </label>
            </div>
            <div className={styles.colorField}>
              <input
                className={styles.swatch}
                id='ig-color'
                type='color'
                value={appliedColor || '#000000'}
                onChange={event => setColor(event.target.value)}
              />
              <input
                className={styles.hex}
                value={color}
                onChange={event => setColor(event.target.value.trim())}
                placeholder='inherit'
                aria-label='Colour, as a six digit hex value'
                spellCheck={false}
                autoComplete='off'
              />
            </div>
          </div>

          <div className={styles.control}>
            <div className={styles.controlHead}>
              <label className={styles.label} htmlFor='ig-stroke'>
                Stroke width
              </label>
              <span className={styles.value}>{trim(stroke)}</span>
            </div>
            <input
              className={styles.slider}
              id='ig-stroke'
              type='range'
              min={STROKE_MIN}
              max={STROKE_MAX}
              step={0.25}
              value={stroke}
              onChange={event => setStroke(Number(event.target.value))}
              style={
                {
                  '--ig-fill': percent(stroke, STROKE_MIN, STROKE_MAX)
                } as CSSProperties
              }
            />
            <p className={styles.hint}>
              {trim((stroke * size) / 24)}px on screen at {size}px
            </p>
          </div>

          <div className={styles.control}>
            <div className={styles.controlHead}>
              <label className={styles.label} htmlFor='ig-size'>
                Size
              </label>
              <span className={styles.value}>{size}px</span>
            </div>
            <input
              className={styles.slider}
              id='ig-size'
              type='range'
              min={SIZE_MIN}
              max={SIZE_MAX}
              step={1}
              value={size}
              onChange={event => setSize(Number(event.target.value))}
              style={
                {
                  '--ig-fill': percent(size, SIZE_MIN, SIZE_MAX)
                } as CSSProperties
              }
            />
          </div>
        </div>

        <p className={styles.note}>
          The customizer sets these with CSS, not props, because CSS beats an
          SVG presentation attribute — so nothing re-renders while you drag.
          Stroke width counts units of a 24 unit viewBox, which is why the width
          on screen depends on the size. The four in-house SVGs draw solid
          shapes, so stroke width leaves them alone.
        </p>
      </section>

      <p className={styles.status} aria-live='polite'>
        {copied
          ? `Copied ${copied}`
          : query
            ? `${matches.length} of ${ICONS.length} icons`
            : `${ICONS.length} icons`}
      </p>

      {matches.length === 0 ? (
        <p className={styles.empty}>No icon matches “{query}”.</p>
      ) : (
        <div
          className={styles.grid}
          style={
            {
              '--ig-size': `${size}px`,
              '--ig-stroke': String(stroke),
              ...(appliedColor ? { color: appliedColor } : null)
            } as CSSProperties
          }
        >
          {matches.map(({ name, Icon }) => (
            <button
              key={name}
              type='button'
              className={copied === name ? styles.tileCopied : styles.tile}
              onClick={() => copy(name)}
              title={name}
              aria-label={`Copy ${name}`}
            >
              <Icon />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
