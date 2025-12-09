import { camelCaseToWords } from '@/lib/utils';
import {
  InfoCircledIcon,
  Pencil2Icon,
  PlusIcon,
  TransformIcon,
  UploadIcon
} from '@radix-ui/react-icons';
import {
  Flex,
  IconButton,
  InputField,
  Select,
  Switch,
  Text
} from '@raystack/apsara';
import { cx } from 'class-variance-authority';
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
  plus: { icon: <PlusIcon />, value: '<PlusIcon />' },
  transform: { icon: <TransformIcon />, value: '<TransformIcon />' },
  pencil: { icon: <Pencil2Icon />, value: '<Pencil2Icon />' },
  info: { icon: <InfoCircledIcon />, value: '<InfoCircledIcon />' },
  upload: { icon: <UploadIcon />, value: '<UploadIcon />' }
};

export default function DemoControls({
  controls,
  componentProps,
  onPropChange
}: PropControlsProps) {
  return (
    <div className={styles.form}>
      {Object.entries(controls).map(([prop, control]) => {
        const propLabel = camelCaseToWords(prop);
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
                <Text variant='secondary' size='small' weight='medium'>
                  {propLabel}
                </Text>
                <Switch
                  size='small'
                  checked={!!componentProps[prop]}
                  onCheckedChange={checked => {
                    if (isCheckbox) onPropChange(prop, checked);
                    else
                      onPropChange(
                        prop,
                        checked ? String(ICONS_MAP.plus.value) : ''
                      );
                  }}
                />
              </Flex>
              {isIcon && (
                <Flex gap={2} align='center' className={styles.iconContainer}>
                  {Object.values(ICONS_MAP).map((icon, index) => (
                    <IconButton
                      key={index}
                      size={3}
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
              <Text
                variant='secondary'
                size='mini'
                weight='medium'
                className={styles.selectLabel}
              >
                {propLabel}
              </Text>
              <Select
                value={selectValue}
                onValueChange={value => onPropChange(prop, value)}
              >
                <Select.Trigger
                  size='small'
                  className={cx(styles.selectTrigger, styles.noShadow)}
                >
                  <Select.Value placeholder={`Select ${propLabel}`} />
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
              label={propLabel}
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
              className={cx(styles.noShadow, styles.inputLabel)}
            />
          </div>
        );
      })}
    </div>
  );
}
