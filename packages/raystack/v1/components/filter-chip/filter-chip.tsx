import { Cross1Icon } from "@radix-ui/react-icons";
import { ReactElement, ReactNode, useEffect, useState } from "react";

import { Box } from "../box";
import { DatePicker } from "../calendar";
import { Flex } from "../flex";
import { Select } from "../select";
import { Text } from "../text";
import { TextField } from "../textfield";
import styles from "./filter-chip.module.css";
import {
  FilterOperation,
  filterOperators,
  FilterSelectOption,
  FilterType,
  FilterTypes,
} from "~/v1/types/filters";
import { cva, cx, VariantProps } from "class-variance-authority";

const chip = cva(styles.chip, {
  variants: {
    variant: {
      default: styles["chip-default"],
      text: null,
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface FilterChipProps extends VariantProps<typeof chip> {
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
  columnType = FilterType.string,
  onOperationSelect,
}: OperationProps) => {
  const filterOptions = filterOperators[columnType] || [];
  // FilterOperatorTypes gives error as Select returns string
  const [value, setValue] = useState<string>(filterOptions?.[0]?.value);

  useEffect(() => {
    const selectedOption = filterOptions.find(o => o.value === value);
    if (selectedOption) {
      onOperationSelect(selectedOption);
    }
  }, [value]);

  return (
    <Select
      value={value}
      onValueChange={setValue}
      aria-labelledby={`${label}-label`}>
      <Select.Trigger
        variant="text"
        className={styles.selectValue}
        aria-label={`${label} filter operation`}>
        <Select.Value
          placeholder="Select operation"
          className={styles.operationText}
        />
      </Select.Trigger>
      <Select.Content data-variant="filter">
        {filterOptions.map(opt => {
          return (
            <Select.Item
              key={opt.value}
              value={opt.value}
              aria-label={`Filter ${label} ${opt.label}`}>
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
  onRemove,
  className,
  ref,
  columnType = FilterType.string,
  options = [],
  onValueChange,
  onOperationChange,
  leadingIcon,
  variant,
  ...props
}: FilterChipProps) => {
  const [operation, setOperation] = useState<FilterOperation>();
  const [filterValue, setFilterValue] = useState<any>(value || "");

  const showOnRemove = typeof onRemove === "function";

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
          <Select value={filterValue.toString()} onValueChange={setFilterValue}>
            <Select.Trigger
              variant="text"
              className={cx(styles.selectValue, styles.selectColumn)}>
              <Select.Value placeholder="Select value" />
            </Select.Trigger>
            <Select.Content data-variant="filter">
              {options.map(opt => (
                <Select.Item
                  key={opt.value.toString()}
                  value={opt.value.toString()}>
                  {opt.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        );
      case FilterType.date:
        return (
          <div className={styles.dateFieldWrapper}>
            <DatePicker
              value={filterValue}
              onSelect={date => setFilterValue(date)}
              showCalendarIcon={false}
              inputFieldProps={{ className: styles.dateField }}
            />
          </div>
        );
      default:
        return (
          <div className={styles.textFieldWrapper}>
            <TextField
              className={styles.textField}
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <Box
      ref={ref}
      className={chip({ variant, className })}
      role="group"
      aria-label={`Filter by ${label}`}
      {...props}>
      <Flex align="center">
        <Flex align="center" gap={2}>
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
        {showOnRemove && (
          <button
            className={styles.removeIconContainer}
            aria-label={`Remove ${label} filter`}
            onClick={onRemove}>
            <Cross1Icon className={styles.removeIcon} />
          </button>
        )}
      </Flex>
    </Box>
  );
};

FilterChip.displayName = "FilterChip";
