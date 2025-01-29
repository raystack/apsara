import { Cross1Icon } from "@radix-ui/react-icons";
import { ReactNode, useEffect, useState, ReactElement } from "react";
import { Box } from "../box";
import { Flex } from "../flex";
import { Select } from "../select";
import { Text } from "../text";
import { TextField } from "../textfield";
import { DatePicker, RangePicker } from "../calendar";
import styles from "./filter-chip.module.css";

type FilterVariant = 'select' | 'text' | 'date' | 'range' | 'number';

export interface FilterChipProps {
  label: string;
  value?: string;
  onRemove?: () => void;
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
  children?: ReactNode;
  columnType?: FilterVariant;
  options?: Array<{ label: string; value: string }>;
  onValueChange?: (value: any) => void;
  onOperationChange?: (operation: string) => void;
  leadingIcon?: ReactElement;
}

export const FilterChip = ({
  label,
  value,
  onRemove,
  className,
  ref,
  columnType = 'text',
  options = [],
  onValueChange,
  onOperationChange,
  leadingIcon,
  ...props
}: FilterChipProps) => {
  const [operation, setOperation] = useState('is');
  const [filterValue, setFilterValue] = useState<any>(value || '');

  const operationOptions = [
    { label: 'is', value: 'is' },
    { label: 'is not', value: 'is not' },
    { label: 'contains', value: 'contains' },
  ];

  useEffect(() => {
    if (onOperationChange) {
      onOperationChange(operation);
    }
  }, [operation]);

  useEffect(() => {
    if (onValueChange) {
      onValueChange(filterValue);
    }
  }, [filterValue]);

  const renderValueInput = () => {
    switch (columnType) {
      case 'select':
        return (
          <Select
            value={filterValue}
            onValueChange={setFilterValue}
          >
            <Select.Trigger variant="filter">
              <div className={styles.selectValue}>
                <Select.Value placeholder="Select value" />
              </div>
            </Select.Trigger>
            <Select.Content data-variant="filter">
              {options.map((opt) => (
                <Select.Item key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        );
      case 'date':
        return (
          <div className={styles.dateFieldWrapper}>
            <DatePicker 
              onSelect={(date) => setFilterValue(date)}
              textFieldProps={{ className: styles.dateField }}
            />
          </div>
        );
      case 'range':
        return (
          <RangePicker
            onSelect={(range) => setFilterValue(range)}
            value={filterValue}
          />
        );
      default:
        return (
          <div className={styles.textFieldWrapper}>
            <TextField
              className={styles.textField}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <Box
      ref={ref}
      className={[styles.chip, className].filter(Boolean).join(" ")}
      {...props}
    >
      <Flex align="center">
        <Flex align="center" style={{ gap: 'var(--rs-space-2)' }}>
          {leadingIcon && (
            <span className={styles.leadingIcon}>
              {leadingIcon}
            </span>
          )}
          <Text size={2} weight="normal">
            {label}
          </Text>
        </Flex>
        <Select defaultValue={operation} onValueChange={setOperation}>
          <Select.Trigger className={styles.operation} variant="filter">
            <span className={styles.operationText}>{operation}</span>
          </Select.Trigger>
          <Select.Content>
            {operationOptions.map((opt) => (
              <Select.Item key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        {renderValueInput()}
        {onRemove && (
          <div className={styles.removeIconContainer}>
            <Cross1Icon 
              className={styles.removeIcon}
              onClick={onRemove}
              aria-label="Remove filter"
            />
          </div>
        )}
      </Flex>
    </Box>
  );
};

FilterChip.displayName = "FilterChip";
