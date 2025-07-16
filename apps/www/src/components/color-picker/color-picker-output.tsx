'use client';
import { Select } from '@raystack/apsara';
import { cx } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import { useColorPicker } from './color-picker-base';
import styles from './color-picker.module.css';

const FORMATS = ['hex', 'rgb', 'css', 'hsl'];

export interface ColorPickerOutputProps
  extends ComponentProps<typeof Select.Trigger> {}

export const ColorPickerOutput = ({
  className,
  ...props
}: ColorPickerOutputProps) => {
  const { mode, setMode } = useColorPicker();
  return (
    <Select onValueChange={setMode} value={mode}>
      <Select.Trigger
        className={cx(styles.selectTrigger, className)}
        {...props}
      >
        <Select.Value placeholder='Mode' />
      </Select.Trigger>
      <Select.Content>
        {FORMATS.map(format => (
          <Select.Item key={format} value={format}>
            {format.toUpperCase()}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};
