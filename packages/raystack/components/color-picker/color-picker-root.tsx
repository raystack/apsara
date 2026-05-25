'use client';

import {
  ComponentProps,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';
import { Flex } from '../flex';
import {
  ColorObject,
  clampToSrgb,
  getColorString,
  ModeType,
  parseColor
} from './utils';

type ColorPickerContextValue = {
  lightness: number;
  chroma: number;
  hue: number;
  alpha: number;
  mode: ModeType;
  setColor: (color: Partial<ColorObject>) => void;
  setMode: (mode: ModeType) => void;
};

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(
  undefined
);

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext);
  if (!context) {
    throw new Error('useColorPicker must be used within a ColorPickerProvider');
  }
  return context;
};

export interface ColorPickerProps
  extends Omit<ComponentProps<typeof Flex>, 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, mode: string) => void;
  defaultMode?: ModeType;
  mode?: ModeType;
  onModeChange?: (mode: ModeType) => void;
}

export const ColorPickerRoot = ({
  value,
  defaultValue = '#ffffff',
  onValueChange,
  defaultMode = 'hex',
  mode: providedMode,
  onModeChange,
  ...props
}: ColorPickerProps) => {
  const providedColor = useMemo(
    () => (value ? parseColor(value) : undefined),
    [value]
  );

  const [internalColor, setInternalColor] = useState(() =>
    parseColor(defaultValue)
  );
  const [internalMode, setInternalMode] = useState(defaultMode);

  const mode = providedMode ?? internalMode;

  // In non-oklch modes, derive a display value clamped to the sRGB gamut so
  // the pad / thumb / input only reflect colors the active output mode can
  // actually represent. Internal state stays raw so switching back to oklch
  // restores any wide-gamut pick the user hadn't yet overwritten.
  const rawColor = useMemo<ColorObject>(
    () => ({
      l: providedColor ? providedColor.l : internalColor.l,
      c: providedColor ? providedColor.c : internalColor.c,
      h: providedColor ? providedColor.h : internalColor.h,
      alpha: (providedColor ? providedColor.alpha : internalColor.alpha) ?? 1
    }),
    [providedColor, internalColor]
  );
  // clampToSrgb wraps culori's clampChroma, which is iterative — memoize so
  // it doesn't re-run on unrelated re-renders during a drag.
  const display = useMemo(
    () => (mode === 'oklch' ? rawColor : clampToSrgb(rawColor)),
    [mode, rawColor]
  );

  const lightness = display.l;
  const chroma = display.c;
  const hue = display.h;
  const alpha = display.alpha ?? 1;

  // Mirror the current effective color in a ref so setColor can compute the
  // next value synchronously, without putting onValueChange inside the
  // setInternalColor updater (where StrictMode would fire it twice).
  const rawColorRef = useRef(rawColor);
  rawColorRef.current = rawColor;

  const setColor = useCallback<ColorPickerContextValue['setColor']>(
    value => {
      const next = { ...rawColorRef.current, ...value };
      rawColorRef.current = next;
      setInternalColor(next);
      onValueChange?.(getColorString(next, mode), mode);
    },
    [mode, onValueChange]
  );

  const setMode = useCallback<ColorPickerContextValue['setMode']>(
    value => {
      setInternalMode(value);
      onModeChange?.(value);
    },
    [onModeChange]
  );

  return (
    <ColorPickerContext
      value={{
        lightness,
        chroma,
        hue,
        alpha,
        mode,
        setColor,
        setMode
      }}
    >
      <Flex direction='column' gap={4} {...props} />
    </ColorPickerContext>
  );
};

ColorPickerRoot.displayName = 'ColorPicker';
