/**
 * Props for the root ColorPicker component.
 */
export interface ColorPickerProps {
  /**
   * The controlled color value. Accepts hex, rgb, hsl, etc.
   */
  value?: string;
  /**
   * The default color value.
   * @default '#ffffff'
   */
  defaultValue?: string;
  /**
   * Callback fired when the color value changes.
   */
  onValueChange?: (value: string, mode: string) => void;
  /**
   * The initial color mode (hex, rgb, hsl).
   * @default 'hex'
   */
  defaultMode?: 'hex' | 'rgb' | 'hsl';
  /**
   * The controlled color mode.
   */
  mode?: 'hex' | 'rgb' | 'hsl';
  /**
   * Callback fired when the color mode changes.
   */
  onModeChange?: (mode: string) => void;
}

/**
 * Props for the ColorPicker.Mode subcomponent.
 */
export interface ColorPickerModeProps {
  /**
   * Supported color modes for the picker.
   * @default ['hex', 'rgb', 'hsl']
   */
  options?: Array<'hex' | 'rgb' | 'hsl'>;
}
