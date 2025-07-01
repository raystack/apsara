import { useCallback } from 'react';
import { FilterOperation, FilterOperator } from '~/types/filters';
import { Select } from '../select';
import { Text } from '../text';
import styles from './filter-chip.module.css';

interface OperationProps {
  label: string;
  value: FilterOperation;
  onChange: (operation: FilterOperation) => void;
  operations: FilterOperator<string>[];
}

export const Operation = ({
  label,
  value,
  onChange,
  operations
}: OperationProps) => {
  const operationValue = value.value;

  const handleValueChange = useCallback(
    (newValue: string) => {
      const operation = operations.find(o => o.value === newValue);
      if (operation) onChange(operation);
    },
    [operations, onChange]
  );

  if (operations.length === 1)
    return (
      <Text variant='secondary' className={styles.selectValue}>
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
        className={styles.selectValue}
        aria-label={`${label} filter operation`}
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
              {operation.label}
            </Select.Item>
          );
        })}
      </Select.Content>
    </Select>
  );
};
