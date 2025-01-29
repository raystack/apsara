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
              <Select.Value placeholder="Select value" />
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
          <DatePicker
            onSelect={(date) => setFilterValue(date)}
            value={filterValue}
          />
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
          <TextField
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        );
    }
  };

  return (
    <Box
      ref={ref}
      className={[styles.chip, className].filter(Boolean).join(" ")}
      {...props}
    >
      <Flex gap="small" align="center">
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
            <Select.Value />
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
          <Cross1Icon 
            className={styles.removeIcon}
            onClick={onRemove}
            aria-label="Remove filter"
          />
        )}
      </Flex>
    </Box>
  );
};

FilterChip.displayName = "FilterChip";
