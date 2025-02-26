import { Cross1Icon } from "@radix-ui/react-icons";
import { ReactNode, useEffect, useState, ReactElement } from "react";
import { Box } from "../box";
import { Flex } from "../flex";
import { Select } from "../select";
import { Text } from "../text";
import { TextField } from "../textfield";
import { DatePicker, RangePicker } from "../calendar";
import styles from "./filter-chip.module.css";
import {
  FilterSelectOption,
  FilterOperation,
  FilterType,
  FilterTypes,
  filterOperationsMap,
} from "~/v1/types/filters";

export interface FilterChipProps {
  label: string;
  value?: string;
  onRemove?: () => void;
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
  children?: ReactNode;
  columnType?: FilterTypes;
  options?: FilterSelectOption[];
  onValueChange?: (value: any) => void;
  onOperationChange?: (operation: string) => void;
  leadingIcon?: ReactElement;
}

interface OperationProps {
  label: string;
  columnType: FilterTypes;
  onOperationSelect: (op: FilterOperation) => void;
}

const Operation = ({
  label,
  columnType = FilterType.text,
  onOperationSelect,
}: OperationProps) => {
  const options = filterOperationsMap[columnType] || [];
  const [value, setValue] = useState(options?.[0]?.value);

  useEffect(() => {
    const selectedOption = options.find((o) => o.value === value);
    if (selectedOption) {
      onOperationSelect(selectedOption);
    }
  }, [value]);

  return (
    <Select
      value={value}
      onValueChange={setValue}
      aria-labelledby={`${label}-label`}
    >
      <Select.Trigger
        className={styles.operation}
        aria-label={`${label} filter operation`}
      >
        <Select.Value placeholder="Select operation" />
      </Select.Trigger>
      <Select.Content data-variant="filter">
        {options.map((opt) => {
          return (
            <Select.Item
              key={opt.value}
              value={opt.value}
              aria-label={`Filter ${label} ${opt.label}`}
            >
              {opt.label}
            </Select.Item>
          );
        })}
      </Select.Content>
    </Select>
  );
};

export const FilterChip = ({
  label,
  value,
  onRemove = () => null,
  className,
  ref,
  columnType = "text",
  options = [],
  onValueChange,
  onOperationChange,
  leadingIcon,
  ...props
}: FilterChipProps) => {
  const [operation, setOperation] = useState<FilterOperation>();
  const [filterValue, setFilterValue] = useState<any>(value || "");

  useEffect(() => {
    if (onOperationChange && operation?.value) {
      onOperationChange(operation?.value);
    }
  }, [operation?.value]);

  useEffect(() => {
    if (onValueChange) {
      onValueChange(filterValue);
    }
  }, [filterValue]);

  const renderValueInput = () => {
    switch (columnType) {
      case FilterType.select:
        return (
          <Select value={filterValue} onValueChange={setFilterValue}>
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
      case FilterType.datetime:
        return (
          <div className={styles.dateFieldWrapper}>
            <DatePicker
              onSelect={(date) => setFilterValue(date)}
              showCalendarIcon={false}
              textFieldProps={{ className: styles.dateField }}
            />
          </div>
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
      role="group"
      aria-label={`Filter by ${label}`}
      {...props}
    >
      <Flex align="center">
        <Flex align="center" style={{ gap: "var(--rs-space-2)" }}>
          {leadingIcon && (
            <span className={styles.leadingIcon} aria-hidden="true">
              {leadingIcon}
            </span>
          )}
          <Text size={2} weight="normal">
            {label}
          </Text>
        </Flex>
        <Operation
          columnType={columnType}
          label={label}
          onOperationSelect={setOperation}
        />
        {renderValueInput()}
        <div
          className={styles.removeIconContainer}
          role="button"
          tabIndex={0}
          aria-label={`Remove ${label} filter`}
        >
          <Cross1Icon className={styles.removeIcon} onClick={onRemove} />
        </div>
      </Flex>
    </Box>
  );
};

FilterChip.displayName = "FilterChip";
