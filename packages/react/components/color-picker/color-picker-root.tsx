'use client';

import type { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { useControlled } from '@base-ui/utils/useControlled';
import {
  ComponentProps,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef
} from 'react';
import {
  type ChangeDetails,
  createChangeDetails
} from '~/shared/change-details';
import { Flex } from '../flex';
import {
  ColorObject,
  clampToSrgb,
  getColorString,
  ModeType,
  parseColor
} from './utils';

export type ColorPickerChangeReason = SliderPrimitive.Root.ChangeEventReason;

export type ColorPickerChangeDetails = ChangeDetails<
  ColorPickerChangeReason,
  { mode: ModeType }
>;

type ColorPickerContextValue = {
  lightness: number;
  chroma: number;
  hue: number;
  alpha: number;
  mode: ModeType;
  setColor: (
    color: Partial<ColorObject>,
    reason: ColorPickerChangeReason,
    event?: Event
  ) => void;
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
  onValueChange?: (value: string, details: ColorPickerChangeDetails) => void;
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

  const [color, setColorUnwrapped] = useControlled({
    controlled: providedColor,
    default: parseColor(defaultValue),
    name: 'ColorPicker',
    state: 'value'
  });
  const [mode, setModeUnwrapped] = useControlled({
    controlled: providedMode,
    default: defaultMode,
    name: 'ColorPicker',
    state: 'mode'
  });

  // In non-oklch modes, derive a display value clamped to the sRGB gamut so
  // the pad / thumb / input only reflect colors the active output mode can
  // actually represent. Internal state stays raw so switching back to oklch
  // restores any wide-gamut pick the user hadn't yet overwritten.
  const rawColor = useMemo<ColorObject>(
    () => ({ ...color, alpha: color.alpha ?? 1 }),
    [color]
  );
  // clampToSrgb wraps culori's clampChroma, which is iterative, so memoize
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
  // state updater (where StrictMode would fire it twice).
  const rawColorRef = useRef(rawColor);
  rawColorRef.current = rawColor;

  const setColor = useCallback<ColorPickerContextValue['setColor']>(
    (value, reason, event) => {
      const next = { ...rawColorRef.current, ...value };
      rawColorRef.current = next;
      setColorUnwrapped(next);
      onValueChange?.(
        getColorString(next, mode),
        createChangeDetails(reason, event, { mode })
      );
    },
    [mode, onValueChange, setColorUnwrapped]
  );

  const setMode = useCallback<ColorPickerContextValue['setMode']>(
    value => {
      setModeUnwrapped(value);
      onModeChange?.(value);
    },
    [onModeChange, setModeUnwrapped]
  );

  // Memoize the context value so consumers (Area, Hue, Alpha, Input, Mode) only
  // re-render when a slice they read actually changes. Without this, every
  // pointermove during a drag would broadcast a fresh object identity to all
  // subcomponents.
  const contextValue = useMemo<ColorPickerContextValue>(
    () => ({ lightness, chroma, hue, alpha, mode, setColor, setMode }),
    [lightness, chroma, hue, alpha, mode, setColor, setMode]
  );

  return (
    <ColorPickerContext value={contextValue}>
      <Flex direction='column' gap={4} data-slot='color-picker' {...props} />
    </ColorPickerContext>
  );
};

ColorPickerRoot.displayName = 'ColorPicker';
