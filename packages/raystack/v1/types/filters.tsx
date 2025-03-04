export const FilterType = {
  number: "number",
  text: "text",
  date: "date",
  select: "select",
} as const;

export type FilterValueType = string | number | boolean;

export interface FilterValue {
  value?: FilterValueType;
  // values?: Array<string | number>;
  date?: Date;
  // dateRange?: DateRange;
}

export type FilterOperation = {
  value: string;
  label: string;
};

export type NumberFilterOperatorType =
  | "eq"
  | "neq"
  | "lt"
  | "lte"
  | "gt"
  | "gte";
export type TextFilterOperatorType = "eq" | "neq" | "like";
export type DateFilterOperatorType = "eq" | "neq" | "lt" | "lte" | "gt" | "gte";
export type SelectFilterOperatorType = "eq" | "neq";

export type FilterOperatorTypes =
  | NumberFilterOperatorType
  | TextFilterOperatorType
  | DateFilterOperatorType
  | SelectFilterOperatorType;

export type FilterOperator<T> = {
  value: T;
  label: string;
};

export type FilterOperatorsMap = {
  number: FilterOperator<NumberFilterOperatorType>[];
  text: FilterOperator<TextFilterOperatorType>[];
  date: FilterOperator<DateFilterOperatorType>[];
  select: FilterOperator<SelectFilterOperatorType>[];
};

export type FilterTypes = keyof typeof FilterType;

export const filterOperators: FilterOperatorsMap = {
  number: [
    { value: "eq", label: "is" },
    { value: "neq", label: "is not" },
    { value: "lt", label: "less than" },
    { value: "lte", label: "less than or equal" },
    { value: "gt", label: "greater than" },
    { value: "gte", label: "greater than or equal" },
  ],
  text: [
    { value: "eq", label: "is" },
    { value: "neq", label: "is not" },
    { value: "like", label: "contains" },
  ],
  date: [
    { value: "eq", label: "is" },
    { value: "neq", label: "is not" },
    { value: "lt", label: "is before" },
    { value: "lte", label: "is on or before" },
    { value: "gt", label: "is after" },
    { value: "gte", label: "is on or after" },
  ],
  select: [
    { value: "eq", label: "is" },
    { value: "neq", label: "is not" },
  ],
} as const;

export type Filter = {
  type: FilterTypes;
  filterOperation: string;
  value: string;
};

export interface FilterSelectOption {
  value: FilterValueType;
  label: string;
}
