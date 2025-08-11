'use client';

import Color, { type ColorLike } from 'color';
import {
  ComponentPropsWithoutRef,
  createContext,
  useCallback,
  useContext,
  useState
} from 'react';
import { Flex } from '../flex';
import { ColorObject, ModeType, getColorString } from './utils';

type ColorPickerContextValue = {
  hue: number;
  saturation: number;
  lightness: number;
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
  extends Omit<ComponentPropsWithoutRef<typeof Flex>, 'defaultValue'> {
  value?: ColorLike;
  defaultValue?: ColorLike;
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
  const providedColor = value && (Color(value).hsl().object() as ColorObject);

  const [internalColor, setInternalColor] = useState(
    Color(defaultValue).hsl().object() as ColorObject
  );
  const [internalMode, setInternalMode] = useState(defaultMode);

  const hue = providedColor ? providedColor.h : internalColor.h;
  const saturation = providedColor ? providedColor.s : internalColor.s;
  const lightness = providedColor ? providedColor.l : internalColor.l;
  const alpha =
    (providedColor ? providedColor?.alpha : internalColor?.alpha) ?? 1;

  const mode = providedMode ?? internalMode;

  const setColor = useCallback<ColorPickerContextValue['setColor']>(
    value => {
      setInternalColor(_color => {
        const updatedColor = { ..._color, ...value };

        if (!onValueChange) return updatedColor;

        const color = Color.hsl(
          updatedColor.h,
          updatedColor.s,
          updatedColor.l,
          updatedColor?.alpha ?? 1
        );

        onValueChange(getColorString(color, mode), mode);

        return updatedColor;
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
    <ColorPickerContext.Provider
      value={{
        hue,
        saturation,
        lightness,
        alpha,
        mode,
        setColor,
        setMode
      }}
    >
      <Flex direction='column' gap={4} {...props} />
    </ColorPickerContext.Provider>
  );
};
