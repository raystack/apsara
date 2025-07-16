'use client';
import { Flex } from '@raystack/apsara';
import Color from 'color';
import {
  ComponentPropsWithoutRef,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

type ColorPickerContextValue = {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
  mode: string;
  setHue: (hue: number) => void;
  setSaturation: (saturation: number) => void;
  setLightness: (lightness: number) => void;
  setAlpha: (alpha: number) => void;
  setMode: (mode: string) => void;
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
  value?: Parameters<typeof Color>[0];
  defaultValue?: Parameters<typeof Color>[0];
  onValueChange?: (value: Parameters<typeof Color.rgb>[0]) => void;
}
export const ColorPicker = ({
  value,
  defaultValue = '#000000',
  onValueChange,
  ...props
}: ColorPickerProps) => {
  const color = Color(value ?? defaultValue);

  const [hue, setHue] = useState(color.hue() || 0);
  const [saturation, setSaturation] = useState(color.saturationl() || 100);
  const [lightness, setLightness] = useState(color.lightness() || 50);
  const [alpha, setAlpha] = useState(color.alpha() * 100 || 100);
  const [mode, setMode] = useState('hex');
  // Update color when controlled value changes
  useEffect(() => {
    if (value) {
      const color = Color.rgb(value).rgb().object();
      setHue(color.r);
      setSaturation(color.g);
      setLightness(color.b);
      setAlpha(color.a);
    }
  }, [value]);
  // Notify parent of changes
  useEffect(() => {
    if (onValueChange) {
      const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100);
      const rgba = color.rgb().array();
      onValueChange([rgba[0], rgba[1], rgba[2], alpha / 100]);
    }
  }, [hue, saturation, lightness, alpha, onValueChange]);
  return (
    <ColorPickerContext.Provider
      value={{
        hue,
        saturation,
        lightness,
        alpha,
        mode,
        setHue,
        setSaturation,
        setLightness,
        setAlpha,
        setMode
      }}
    >
      <Flex direction='column' gap={4} {...props} />
    </ColorPickerContext.Provider>
  );
};
