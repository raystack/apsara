export const FilterType = {
  number: 'number',
  string: 'string',
  date: 'date',
  select: 'select',
  multiselect: 'multiselect'
} as const;

export const EmptyFilterValue = "--empty--";

export type FilterValueType = 'string' | 'number' | 'boolean';

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


export type StringFilterOperatorRQLType = 'eq' | 'neq' | 'ilike';

export type NumberFilterOperatorType =
  | 'eq'
  | 'neq'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte';
export type StringFilterOperatorType = 'eq' | 'neq' | 'like';
export type DateFilterOperatorType = 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte';
export type SelectFilterOperatorType = 'eq' | 'neq';
export type MultiSelectFilterOperatorType = 'in' | 'notin';

export type FilterOperatorTypes =
  | NumberFilterOperatorType
  | StringFilterOperatorType
  | DateFilterOperatorType
  | SelectFilterOperatorType
  | MultiSelectFilterOperatorType
  | 'empty';

export type RQLFilterOperatorTypes =
  | NumberFilterOperatorType
  | StringFilterOperatorRQLType
  | DateFilterOperatorType
  | SelectFilterOperatorType
  | MultiSelectFilterOperatorType
  | 'empty';

export type FilterOperator<T> = {
  /**
   * @description Value of the filter operator
   */
  value: T;
  /**
   * @description Label to be shown in the filter chip operation
   */
  label: string;
  /**
   * @description Used to show alternate operation label when single value is selected in multiselect column
   */
  alternateLabel?: string;
};

export type FilterOperatorsMap = {
  number: FilterOperator<NumberFilterOperatorType>[];
  string: FilterOperator<StringFilterOperatorType>[];
  date: FilterOperator<DateFilterOperatorType>[];
  select: FilterOperator<SelectFilterOperatorType>[];
  multiselect: FilterOperator<MultiSelectFilterOperatorType>[];
};

export type FilterTypes = keyof typeof FilterType;

export const filterOperators: FilterOperatorsMap = {
  number: [
    { value: 'eq', label: 'is' },
    { value: 'neq', label: 'is not' },
    { value: 'lt', label: 'less than' },
    { value: 'lte', label: 'less than or equal' },
    { value: 'gt', label: 'greater than' },
    { value: 'gte', label: 'greater than or equal' }
  ],
  string: [
    { value: 'eq', label: 'is' },
    { value: 'neq', label: 'is not' },
    { value: 'like', label: 'contains' }
  ],
  date: [
    { value: 'eq', label: 'is' },
    { value: 'neq', label: 'is not' },
    { value: 'lt', label: 'is before' },
    { value: 'lte', label: 'is on or before' },
    { value: 'gt', label: 'is after' },
    { value: 'gte', label: 'is on or after' }
  ],
  select: [
    { value: 'eq', label: 'is' },
    { value: 'neq', label: 'is not' }
  ],
  multiselect: [
    { value: 'in', label: 'is any of', alternateLabel: 'is' },
    { value: 'notin', label: 'is none of', alternateLabel: 'is not' }
  ]
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
