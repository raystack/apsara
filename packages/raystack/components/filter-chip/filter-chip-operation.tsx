import { cx } from 'class-variance-authority';
import { useCallback } from 'react';
import { FilterOperation, FilterOperator } from '~/types/filters';
import { Select } from '../select';
import { Text } from '../text';
import styles from './filter-chip.module.css';

interface OperationProps {
  label: string;
  value?: FilterOperation;
  onChange: (operation: FilterOperation) => void;
  operations: FilterOperator<string>[];
  showAlternateLabel?: boolean;
}

export const Operation = ({
  label,
  value,
  onChange,
  operations,
  showAlternateLabel = false
}: OperationProps) => {
  const operationValue = value?.value ?? '';

  const handleValueChange = useCallback(
    (newValue: string) => {
      const operation = operations.find(o => o.value === newValue);
      if (operation) onChange(operation);
    },
    [operations, onChange]
  );

  if (operations.length === 1)
    return (
      <Text
        variant='secondary'
        className={cx(styles.selectValue, styles.operationValue)}
      >
        {operations[0].label}
      </Text>
    );

  return (
    <Select
      value={operationValue}
      onValueChange={handleValueChange}
      aria-labelledby={`${label}-label`}
    >
      <Select.Trigger
        variant='text'
        className={cx(styles.selectValue, styles.operationValue)}
        aria-label={`${label} filter operation`}
        iconProps={{
          style: {
            display: 'none'
          }
        }}
      >
        <Select.Value
          placeholder='Select operation'
          className={styles.operationText}
        />
      </Select.Trigger>
      <Select.Content data-variant='filter'>
        {operations.map(operation => {
          return (
            <Select.Item
              key={operation.value}
              value={operation.value}
              aria-label={`Filter ${label} ${operation.label}`}
            >
              {showAlternateLabel && operation?.alternateLabel
                ? operation.alternateLabel
                : operation.label}
            </Select.Item>
          );
        })}
      </Select.Content>
    </Select>
  );
};
