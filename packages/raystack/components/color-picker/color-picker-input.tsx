'use client';

import { ComponentProps, useMemo } from 'react';
import { CopyButton } from '../copy-button';
import { Input } from '../input';
import { useColorPicker } from './color-picker-root';
import { getColorString } from './utils';

export interface ColorPickerInputProps extends ComponentProps<typeof Input> {
  /**
   * Render a copy-to-clipboard button inside the input's trailing slot.
   * The button copies the current formatted color string in the active mode.
   * @default false
   */
  copyable?: boolean;
}

export const ColorPickerInput = ({
  copyable = false,
  trailingIcon,
  ...props
}: ColorPickerInputProps) => {
  const { lightness, chroma, hue, alpha, mode } = useColorPicker();
  const value = useMemo(
    () =>
      getColorString(
        { l: lightness, c: chroma, h: hue, alpha: alpha ?? 1 },
        mode
      ),
    [lightness, chroma, hue, alpha, mode]
  );

  // A consumer-supplied trailingIcon always wins; copyable only fills the slot
  // when no trailingIcon was provided. size=2 matches the Input's trailing-icon
  // wrapper width (--rs-space-5).
  const resolvedTrailingIcon =
    trailingIcon ??
    (copyable ? <CopyButton text={value} size={2} /> : undefined);

  return (
    <Input
      value={value}
      readOnly
      trailingIcon={resolvedTrailingIcon}
      {...props}
    />
  );
};

ColorPickerInput.displayName = 'ColorPicker.Input';
