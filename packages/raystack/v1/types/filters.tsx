export const FilterType = {
  number: "number",
  text: "text",
  datetime: "datetime",
  select: "select",
} as const;

export type FilterOperation = {
  value: string;
  label: string;
};

type FilterOperationsMap = {
  [key in keyof typeof FilterType]: FilterOperation[];
};

export const filterOperationsMap: FilterOperationsMap = {
  number: [
    { value: "eq", label: "is" },
    { value: "neq", label: "is Not" },
    { value: "lt", label: "Less Than" },
    { value: "lte", label: "Less Than or Equal" },
    { value: "gt", label: "Greater Than" },
    { value: "gte", label: "Greater Than or Equal" },
  ],
  text: [
    { value: "eq", label: "is" },
    { value: "neq", label: "is Not" },
    { value: "like", label: "Contains" },
  ],
  datetime: [
    { value: "eq", label: "is" },
    { value: "neq", label: "is Not" },
    { value: "lt", label: "is Before" },
    { value: "lte", label: "is On or Before" },
    { value: "gt", label: "is After" },
    { value: "gte", label: "is On or After" },
  ],
  select: [
    { value: "eq", label: "is" },
    { value: "neq", label: "is Not" },
  ],
} as const;

export type FilterTypes = keyof typeof FilterType;

export type Filter = {
  type: FilterTypes;
  filterOperation: string;
  value: string;
};

export interface FilterSelectOption {
  value: any;
  label: string;
}
