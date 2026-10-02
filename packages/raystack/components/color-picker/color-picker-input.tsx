'use client';

import { parse } from 'culori';
import { ComponentProps, useMemo, useState } from 'react';
import { CopyButton } from '../copy-button';
import { Input } from '../input';
import { useColorPicker } from './color-picker-root';
import { getColorString, parseColor } from './utils';

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
  onChange,
  onBlur,
  onKeyDown,
  ...props
}: ColorPickerInputProps) => {
  const { lightness, chroma, hue, alpha, mode, setColor } = useColorPicker();
  const value = useMemo(
    () =>
      getColorString(
        { l: lightness, c: chroma, h: hue, alpha: alpha ?? 1 },
        mode
      ),
    [lightness, chroma, hue, alpha, mode]
  );
  // Typed text, held until Enter or blur applies it.
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft === null) return;
    setDraft(null);
    if (draft !== value && parse(draft)) setColor(parseColor(draft));
  };

  // A consumer-supplied trailingIcon always wins; copyable only fills the slot
  // when no trailingIcon was provided. size=2 matches the Input's trailing-icon
  // wrapper width (--rs-space-5).
  const resolvedTrailingIcon =
    trailingIcon ??
    (copyable ? <CopyButton text={value} size={2} /> : undefined);

  return (
    <Input
      value={draft ?? value}
      onChange={event => {
        setDraft(event.target.value);
        onChange?.(event);
      }}
      onBlur={event => {
        commit();
        onBlur?.(event);
      }}
      onKeyDown={event => {
        if (event.key === 'Enter') commit();
        onKeyDown?.(event);
      }}
      trailingIcon={resolvedTrailingIcon}
      data-slot='color-picker-input'
      {...props}
    />
  );
};

ColorPickerInput.displayName = 'ColorPicker.Input';
