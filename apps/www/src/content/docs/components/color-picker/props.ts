/**
 * Props for the root ColorPicker component.
 */
export interface ColorPickerProps {
  /**
   * The controlled color value. Accepts hex, rgb, hsl, oklch, etc.
   */
  value?: string;
  /**
   * The default color value.
   * @default '#ffffff'
   */
  defaultValue?: string;
  /**
   * Callback fired when the color value changes. `details.mode` is the active mode.
   */
  onValueChange?: (
    value: string,
    details: {
      reason: 'track-press' | 'drag' | 'keyboard' | 'input-change' | 'none';
      event: Event;
      mode: 'hex' | 'rgb' | 'hsl' | 'oklch';
    }
  ) => void;
  /**
   * The initial color mode (hex, rgb, hsl, oklch).
   * @default 'hex'
   */
  defaultMode?: 'hex' | 'rgb' | 'hsl' | 'oklch';
  /**
   * The controlled color mode.
   */
  mode?: 'hex' | 'rgb' | 'hsl' | 'oklch';
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
   * @default ['hex', 'rgb', 'hsl', 'oklch']
   */
  options?: Array<'hex' | 'rgb' | 'hsl' | 'oklch'>;
}
