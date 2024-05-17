import { Cross1Icon } from "@radix-ui/react-icons";
import { Column, FilterFn } from "@tanstack/table-core";
import { Box } from "~/box";
import { Button } from "~/button";
import { Checkbox } from "~/checkbox";
import { Command } from "~/command";
import { Flex } from "~/flex";
import { Popover } from "~/popover";
import { Select } from "~/select";
import { Text } from "~/text";
import { TextField } from "~/textfield";
import { TableColumnMetadata } from "~/typing";
import styles from "./datatable.module.css";
import {
  ApsaraColumnDef,
  columnTypes,
  columnTypesMap,
  filterValueType,
  filterValueTypeMap,
  updateColumnFilter,
} from "./datatables.types";
import { useTable } from "./hooks/useTable";
import { useCallback, useEffect, useMemo, useState } from "react";

type FilteredChipProps = {
  column: Column<any, unknown>;
  updateColumnCustomFilter: updateColumnFilter;
};

interface FilterValuesProps {
  columnType?: columnTypes;
  onValueChange?: (value: FilterValue) => void;
  options?: TableColumnMetadata[];
}

const FilterValues = ({
  columnType = filterValueTypeMap.text,
  options = [],
  onValueChange,
}: FilterValuesProps) => {
  const [value, setValue] = useState("");
  const valueType: filterValueType =
    columnType === columnTypesMap.select
      ? filterValueTypeMap.select
      : filterValueTypeMap.text;

  useEffect(() => {
    if (value && onValueChange) {
      onValueChange({ value });
    }
  }, [value]);
  return valueType === filterValueTypeMap.select ? (
    <Select value={value} onValueChange={setValue}>
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
  ) : (
    <TextField value={value} onChange={(e) => setValue(e.target.value)} />
  );
};

interface FilterOperation {
  label: string;
  value: string;
  fn?: FilterFn<FilterValue>;
}

const operationsOptions: Record<columnTypes, Array<FilterOperation>> = {
  [columnTypesMap.select]: [
    {
      label: "is",
      value: "is",
      fn: (row, columnId, filterValue: FilterValue) => {
        return row.getValue(columnId) === filterValue.value;
      },
    },
    {
      label: "is not",
      value: "is not",
      fn: (row, columnId, filterValue: FilterValue) => {
        return row.getValue(columnId) !== filterValue.value;
      },
    },
  ],
  [columnTypesMap.number]: [
    {
      label: "=",
      value: "=",
      fn: (row, columnId, filterValue: FilterValue) => {
        return row.getValue(columnId) === filterValue.value;
      },
    },
    {
      label: "not =",
      value: "not =",
      fn: (row, columnId, filterValue: FilterValue) => {
        return row.getValue(columnId) !== filterValue.value;
      },
    },
    {
      label: ">",
      value: ">",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) > Number(filterValue.value);
      },
    },
    {
      label: ">=",
      value: ">=",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) >= Number(filterValue.value);
      },
    },
    {
      label: "<",
      value: "<",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) < Number(filterValue.value);
      },
    },
    {
      label: "<=",
      value: "<=",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) <= Number(filterValue.value);
      },
    },
  ],
  [columnTypesMap.text]: [
    { label: "is", value: "is" },
    { label: "is not", value: "is not" },
    { label: "contains", value: "contains" },
    { label: "does not contains", value: "does not contains" },
    { label: "starts with", value: "starts with" },
    { label: "ends with", value: "ends with" },
    { label: "is empty", value: "is empty" },
    { label: "is not empty", value: "is not empty" },
  ],
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
  const [value, setValue] = useState(options?.[0].value);

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

interface FilterValue {
  value?: string | number;
  values?: Array<string | number>;
}

export const FilteredChip = ({
  column,
  updateColumnCustomFilter,
}: FilteredChipProps) => {
  const [filterOperation, setFilterOperation] = useState<FilterOperation>();
  const [filterValue, setFilterValue] = useState<FilterValue>();

  const { table, removeFilterColumn } = useTable();
  const { filterVariant } = column?.columnDef as ApsaraColumnDef;
  const options: TableColumnMetadata[] =
    (column?.columnDef?.meta as any)?.data || [];

  const facets = column?.getFacetedUniqueValues();
  const columnName = (column?.columnDef?.header as string) || column.id;

  useEffect(() => {
    if (filterOperation?.fn && filterValue) {
      updateColumnCustomFilter(column.id, filterOperation?.fn);
      column.setFilterValue(filterValue);
    }
  }, [filterOperation, filterValue]);

  return (
    <Box className={styles.chip}>
      <Text>{columnName}</Text>
      <Operation
        columnType={filterVariant}
        onOperationSelect={setFilterOperation}
      />
      <FilterValues
        columnType={filterVariant}
        options={options}
        onValueChange={setFilterValue}
      />

      {/* render diffrent input base on filterVariant type */}

      {/* close filter chip */}
      <Flex>
        <Cross1Icon
          height="12"
          width="12"
          onClick={() => {
            column.setFilterValue(undefined);
            removeFilterColumn(column.id);
          }}
        />
      </Flex>
    </Box>
  );
};
