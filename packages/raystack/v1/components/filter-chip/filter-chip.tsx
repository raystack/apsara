import { Cross1Icon } from "@radix-ui/react-icons";
import { ReactNode, useEffect, useState, ReactElement } from "react";
import { Box } from "../box";
import { Flex } from "../flex";
import { Select } from "../select";
import { Text } from "../text";
import { TextField } from "../textfield";
import { DatePicker, RangePicker } from "../calendar";
import styles from "./filter-chip.module.css";
import { FilterType, FilterTypes } from "~/v1/types/filters";

export interface FilterChipProps {
  label: string;
  value?: string;
  onRemove?: () => void;
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
  children?: ReactNode;
  columnType?: FilterTypes;
  options?: Array<{ label: string; value: string }>;
  onValueChange?: (value: any) => void;
  onOperationChange?: (operation: string) => void;
  leadingIcon?: ReactElement;
}

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
  const [operation, setOperation] = useState("is");
  const [filterValue, setFilterValue] = useState<any>(value || "");

  const operationOptions = [
    { label: "is", value: "is" },
    { label: "is not", value: "is not" },
    { label: "contains", value: "contains" },
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
        <Select
          defaultValue={operation}
          onValueChange={setOperation}
          aria-labelledby={`${label}-label`}
        >
          <Select.Trigger
            className={styles.operation}
            variant="filter"
            aria-label={`${label} filter operation`}
          >
            <span className={styles.operationText}>{operation}</span>
          </Select.Trigger>
          <Select.Content data-variant="filter">
            {operationOptions.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                aria-label={`Filter ${label} ${opt.label}`}
              >
                {opt.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
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
