import { Cross1Icon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/table-core";
import { Box } from "~/box";
import { Flex } from "~/flex";
import { Select } from "~/select";
import { Text } from "~/text";
import { TextField } from "~/textfield";
import { TableColumnMetadata } from "~/typing";
import { DatePicker, RangePicker } from "~/calendar";
import styles from "./datatable.module.css";
import {
  ApsaraColumnDef,
  FilterValue,
  columnTypes,
  columnTypesMap,
  filterValueType,
  filterValueTypeMap,
  updateColumnFilter,
} from "./datatables.types";
import { useTable } from "./hooks/useTable";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FilterOperation, operationsOptions } from "./filterFns";

type FilteredChipProps = {
  column: Column<any, unknown>;
  updateColumnCustomFilter: updateColumnFilter;
};

interface FilterValuesProps {
  columnType?: columnTypes;
  onValueChange?: (value: FilterValue) => void;
  options?: TableColumnMetadata[];
  filterOperation?: FilterOperation;
}

const FilterValues = ({
  columnType = filterValueTypeMap.text,
  options = [],
  onValueChange,
  filterOperation,
  ...props
}: FilterValuesProps) => {
  const [value, setValue] = useState<FilterValue>({
    date: new Date(),
    dateRange: {
      to: new Date(),
      from: new Date(),
    },
  });

  const valueType: filterValueType = filterOperation?.component
    ? filterOperation?.component
    : columnType === columnTypesMap.date
    ? filterValueTypeMap.datePicker
    : columnType === columnTypesMap.select
    ? filterValueTypeMap.select
    : filterValueTypeMap.text;

  useEffect(() => {
    if (onValueChange) {
      onValueChange(value);
    }
  }, [value]);

  return valueType === filterValueTypeMap.select ? (
    <Select
      value={value.value as string}
      onValueChange={(value) => setValue({ value })}
    >
      <Select.Trigger>
        <Select.Value placeholder="Select value" />
      </Select.Trigger>
      <Select.Content>
        {options.map((opt) => {
          return (
            <Select.Item key={opt.key} value={opt.value}>
              {opt.label || opt.value}
            </Select.Item>
          );
        })}
      </Select.Content>
    </Select>
  ) : valueType === filterValueTypeMap.datePicker ? (
    <DatePicker onSelect={(date) => setValue({ date })} value={value.date} />
  ) : valueType === filterValueTypeMap.rangePicker ? (
    <RangePicker
      onSelect={(dateRange) => setValue({ dateRange })}
      value={value.dateRange}
    />
  ) : (
    <TextField
      value={value.value}
      onChange={(e) => setValue({ value: e.target.value })}
    />
  );
};

interface OperationProps {
  columnType?: columnTypes;
  onOperationSelect: (op: FilterOperation) => void;
}

const Operation = ({
  columnType = columnTypesMap.text,
  onOperationSelect,
}: OperationProps) => {
  const options = operationsOptions[columnType] || [];
  const [value, setValue] = useState(options?.[0]?.value);

  useEffect(() => {
    const selectedOption = options.find((o) => o.value === value);
    if (selectedOption) {
      onOperationSelect(selectedOption);
    }
  }, [value]);

  return (
    <Select defaultValue={value} onValueChange={setValue}>
      <Select.Trigger className={styles.filterOperator}>
        <Select.Value placeholder="Select operation" />
      </Select.Trigger>
      <Select.Content>
        {options.map((opt) => {
          return (
            <Select.Item key={opt.label} value={opt.label}>
              {opt.label}
            </Select.Item>
          );
        })}
      </Select.Content>
    </Select>
  );
};

export const FilteredChip = ({
  column,
  updateColumnCustomFilter,
}: FilteredChipProps) => {
  const [filterOperation, setFilterOperation] = useState<FilterOperation>();
  const [filterValue, setFilterValue] = useState<FilterValue>();

  const { table, removeFilterColumn } = useTable();
  const { filterVariant } = column?.columnDef as ApsaraColumnDef<unknown>;
  const options: TableColumnMetadata[] =
    (column?.columnDef?.meta as any)?.data || [];

  const facets = column?.getFacetedUniqueValues();
  const columnHeader = column?.columnDef?.header;
  const columnName =
    (typeof columnHeader === "string" && columnHeader) || column.id;

  useEffect(() => {
    if (filterOperation?.fn && filterValue) {
      updateColumnCustomFilter(column.id, filterOperation?.fn);
      column.setFilterValue(filterValue);
    }
  }, [filterOperation, filterValue]);

  function removeFilter() {
    column.setFilterValue(undefined);
    removeFilterColumn(column.id);
    setFilterOperation(undefined);
    setFilterValue({});
  }

  return (
    <Box className={styles.chip}>
      <Text className={styles.filterText}>{columnName}</Text>
      <Operation
        columnType={filterVariant}
        onOperationSelect={setFilterOperation}
      />
      {filterOperation?.hideValueField ? null : (
        <FilterValues
          columnType={filterVariant}
          options={options}
          onValueChange={setFilterValue}
          filterOperation={filterOperation}
        />
      )}

      {/* close filter chip */}
      <Flex>
        <Cross1Icon height="12" width="12" onClick={removeFilter} />
      </Flex>
    </Box>
  );
};
