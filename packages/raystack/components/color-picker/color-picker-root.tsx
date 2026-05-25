'use client';

import {
  ComponentProps,
  createContext,
  useCallback,
  useContext,
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
  const providedColor = value ? parseColor(value) : undefined;

  const [internalColor, setInternalColor] = useState(parseColor(defaultValue));
  const [internalMode, setInternalMode] = useState(defaultMode);

  const mode = providedMode ?? internalMode;

  // In non-oklch modes, derive a display value clamped to the sRGB gamut so
  // the pad / thumb / input only reflect colors the active output mode can
  // actually represent. Internal state stays raw so switching back to oklch
  // restores any wide-gamut pick the user hadn't yet overwritten.
  const rawColor: ColorObject = {
    l: providedColor ? providedColor.l : internalColor.l,
    c: providedColor ? providedColor.c : internalColor.c,
    h: providedColor ? providedColor.h : internalColor.h,
    alpha: (providedColor ? providedColor.alpha : internalColor.alpha) ?? 1
  };
  const display = mode === 'oklch' ? rawColor : clampToSrgb(rawColor);

  const lightness = display.l;
  const chroma = display.c;
  const hue = display.h;
  const alpha = display.alpha ?? 1;

  const setColor = useCallback<ColorPickerContextValue['setColor']>(
    value => {
      setInternalColor(prev => {
        const next = { ...prev, ...value };
        onValueChange?.(getColorString(next, mode), mode);
        return next;
      });
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
