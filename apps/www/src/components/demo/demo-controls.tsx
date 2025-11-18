import {
  Flex,
  IconButton,
  InputField,
  Label,
  Select,
  Switch
} from '@raystack/apsara';
import { cx } from 'class-variance-authority';
import { Ban, Home, Info, Laugh, X } from 'lucide-react';
import styles from './styles.module.css';
import {
  ComponentPropsType,
  ControlsType,
  PropChangeHandlerType
} from './types';

type PropControlsProps = {
  controls: ControlsType;
  componentProps: ComponentPropsType;
  onPropChange: PropChangeHandlerType;
};

const ICONS_MAP = {
  none: { icon: <Ban size={16} />, value: '' },
  info: { icon: <Info size={16} />, value: '<Info size={16} />' },
  close: { icon: <X size={16} />, value: '<X size={16} />' },
  home: { icon: <Home size={16} />, value: '<Home size={16} />' },
  laugh: { icon: <Laugh size={16} />, value: '<Laugh size={16} />' }
};

export default function DemoControls({
  controls,
  componentProps,
  onPropChange
}: PropControlsProps) {
  return (
    <div className={styles.form}>
      {Object.entries(controls).map(([prop, control]) => {
        const propValue = componentProps?.[prop] ?? '';
        const isCheckbox = control.type === 'checkbox';
        const isIcon = control.type === 'icon';

        // For checkbox and icon types, render in a special container
        if (isCheckbox || isIcon) {
          return (
            <div key={prop} className={styles.controlSection}>
              <Flex
                align='center'
                justify='between'
                className={styles.controlHeader}
              >
                <Label size='small' className={styles.controlLabel}>
                  {prop}
                </Label>
                {isCheckbox && (
                  <Switch
                    size='small'
                    checked={!!componentProps[prop]}
                    onCheckedChange={checked => onPropChange(prop, checked)}
                  />
                )}
              </Flex>
              {isIcon && (
                <Flex gap={2} align='center' className={styles.iconContainer}>
                  {Object.values(ICONS_MAP).map((icon, index) => (
                    <IconButton
                      key={index}
                      size={1}
                      className={cx(
                        styles.iconButton,
                        propValue === icon.value && styles.active
                      )}
                      onClick={e => {
                        onPropChange(prop, String(icon.value));
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      aria-label={`Select ${icon.value || 'none'} icon`}
                    >
                      {icon.icon}
                    </IconButton>
                  ))}
                </Flex>
              )}
            </div>
          );
        }

        // For select type
        if (control.type === 'select') {
          const selectValue =
            propValue !== undefined && propValue !== null
              ? String(propValue)
              : undefined;
          return (
            <div key={prop} className={styles.controlField}>
              <Label size='small' className={styles.selectLabel}>
                {prop}
              </Label>
              <Select
                value={selectValue}
                onValueChange={value => onPropChange(prop, value)}
              >
                <Select.Trigger
                  size='small'
                  className={cx(styles.selectTrigger, styles.noShadow)}
                >
                  <Select.Value placeholder={`Select ${prop}`} />
                </Select.Trigger>
                <Select.Content>
                  {control.options?.map(option => (
                    <Select.Item key={option} value={option}>
                      {option}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
          );
        }

        // For text and number types
        return (
          <div key={prop} className={styles.controlField}>
            <InputField
              size='small'
              label={prop}
              value={
                control.type === 'number'
                  ? String(Number(propValue))
                  : String(propValue)
              }
              onChange={e => {
                if (control.type === 'number') {
                  onPropChange(prop, Number(e.target.value));
                } else {
                  onPropChange(prop, e.target.value);
                }
              }}
              type={control.type === 'number' ? 'number' : 'text'}
              min={control.min}
              max={control.max}
              className={styles.noShadow}
            />
          </div>
        );
      })}
    </div>
  );
}
