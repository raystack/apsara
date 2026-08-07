'use client';

import * as Apsara from '@raystack/apsara';
import {
  ColorPicker,
  Popover,
  RotateCcwIcon,
  SearchIcon,
  Tooltip
} from '@raystack/apsara';
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

// The grid itself is plain elements: it is the thing being documented, so its
// own chrome should not compete with it. The toolbar does use Apsara — the
// colour popover is our ColorPicker, and the names come from our Tooltip.

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

/**
 * One tooltip for the whole grid, wired up with Base UI's detached triggers:
 * each tile is a `Tooltip.Trigger` carrying its name as the payload, and the
 * single `Tooltip` below renders whichever payload the active trigger sends.
 * A tooltip per tile would mean 243 portals for one visible label.
 *
 * https://base-ui.com/react/components/tooltip#detached-triggers
 */
const nameTooltip = Tooltip.createHandle<string>();

/** The values `createIcon` applies, so a reset returns the real defaults. */
const DEFAULT_STROKE = 1.5;
const DEFAULT_SIZE = 16;

const STROKE_MIN = 0.5;
const STROKE_MAX = 3;
const SIZE_MIN = 12;
const SIZE_MAX = 48;

/** Where the picker starts when nothing has been picked yet. */
const PICKER_SEED = '#000000';

/** Trims a trailing `.00` / `.50` so 1.5 reads as "1.5" and 2 as "2". */
const trim = (value: number) => String(Number(value.toFixed(2)));

const percent = (value: number, min: number, max: number) =>
  `${((value - min) / (max - min)) * 100}%`;

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

  const isDefault =
    stroke === DEFAULT_STROKE && size === DEFAULT_SIZE && color === '';

  const reset = () => {
    setStroke(DEFAULT_STROKE);
    setSize(DEFAULT_SIZE);
    setColor('');
  };

  return (
    <div className={styles.root}>
      <div className={styles.bar}>
        <div className={styles.toolbar}>
          <div className={styles.search}>
            <SearchIcon className={styles.searchIcon} />
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

          <div className={styles.control}>
            <label className={styles.label} htmlFor='ig-size'>
              Size
            </label>
            <span className={styles.value}>{size}px</span>
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

          <div className={styles.control}>
            <label className={styles.label} htmlFor='ig-stroke'>
              Stroke
            </label>
            <span className={styles.value}>{trim(stroke)}</span>
            <input
              className={styles.slider}
              id='ig-stroke'
              type='range'
              min={STROKE_MIN}
              max={STROKE_MAX}
              step={0.25}
              value={stroke}
              onChange={event => setStroke(Number(event.target.value))}
              title={`${trim((stroke * size) / 24)}px on screen at ${size}px`}
              style={
                {
                  '--ig-fill': percent(stroke, STROKE_MIN, STROKE_MAX)
                } as CSSProperties
              }
            />
          </div>

          <Popover>
            <Popover.Trigger className={styles.color}>
              {/* Unset falls back to `currentColor` in CSS, which is what the
                  icons themselves inherit — so the swatch stays honest. */}
              <span
                className={styles.swatch}
                style={color ? { background: color } : undefined}
              />
              <span className={styles.hex}>{color || 'Inherit'}</span>
            </Popover.Trigger>
            <Popover.Content
              className={styles.pickerPopup}
              align='end'
              aria-label='Icon colour'
            >
              <ColorPicker
                className={styles.picker}
                value={color || PICKER_SEED}
                onValueChange={setColor}
              >
                <ColorPicker.Area />
                <ColorPicker.Hue />
                <ColorPicker.Input copyable />
              </ColorPicker>
            </Popover.Content>
          </Popover>

          <button
            type='button'
            className={styles.reset}
            onClick={reset}
            disabled={isDefault}
            title='Reset to the Apsara defaults'
            aria-label='Reset to the Apsara defaults'
          >
            <RotateCcwIcon />
          </button>
        </div>
      </div>

      <p className={styles.srOnly} aria-live='polite'>
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
              ...(color ? { color } : null)
            } as CSSProperties
          }
        >
          {matches.map(({ name, Icon }) => (
            <Tooltip.Trigger
              key={name}
              className={styles.tile}
              handle={nameTooltip}
              payload={name}
              // Names are the point of the grid, so show them on arrival
              // rather than after Tooltip.Trigger's usual 200ms.
              delay={0}
              // The tooltip has to survive the click to become "Copied".
              closeOnClick={false}
              onClick={() => copy(name)}
              data-copied={copied === name || undefined}
              aria-label={`Copy ${name}`}
            >
              <Icon />
            </Tooltip.Trigger>
          ))}
        </div>
      )}

      <Tooltip handle={nameTooltip}>
        {({ payload }) => (
          <Tooltip.Content side='bottom' sideOffset={6}>
            {copied && copied === payload ? 'Copied' : payload}
          </Tooltip.Content>
        )}
      </Tooltip>
    </div>
  );
}
