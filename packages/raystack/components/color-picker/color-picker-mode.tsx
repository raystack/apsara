import { cx } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import { Select } from '../select';
import { useColorPicker } from './color-picker-root';
import styles from './color-picker.module.css';
import { ModeType, SUPPORTED_MODES } from './utils';

export interface ColorPickerModeProps
  extends ComponentProps<typeof Select.Trigger> {
  options?: ModeType[];
}

export const ColorPickerMode = ({
  className,
  options = SUPPORTED_MODES,
  ...props
}: ColorPickerModeProps) => {
  const { mode, setMode } = useColorPicker();
  return (
    <Select onValueChange={value => setMode(value as ModeType)} value={mode}>
      <Select.Trigger
        className={cx(styles.selectTrigger, className)}
        {...props}
      >
        <Select.Value placeholder='Mode' />
      </Select.Trigger>
      <Select.Content>
        {options.map(option => (
          <Select.Item key={option} value={option}>
            {option.toUpperCase()}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};
