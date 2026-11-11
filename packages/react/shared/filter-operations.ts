import type {
  FilterOperator,
  FilterOperatorTypes,
  FilterTypes
} from '~/types/filters';
import { FilterType, filterOperators } from '~/types/filters';

export type FilterOperations =
  | FilterOperator<FilterOperatorTypes>[]
  | ((
      defaults: FilterOperator<FilterOperatorTypes>[]
    ) => FilterOperator<FilterOperatorTypes>[]);

type OperationField = {
  accessorKey?: unknown;
  filterType?: FilterTypes;
  filterOperations?: FilterOperations;
};

type OperatorFilter = {
  name: string;
  operator: FilterOperatorTypes;
};

/**
 * The operations a column offers. An array replaces the operations of the
 * filter type, a function receives them and returns the list to use. An empty
 * result falls back to the type's own operations, since a chip needs one
 * operation to filter with.
 */
export function resolveFilterOperations(
  filterType: FilterTypes = FilterType.string,
  operations?: FilterOperations
): FilterOperator<FilterOperatorTypes>[] {
  const defaults = filterOperators[
    filterType
  ] as FilterOperator<FilterOperatorTypes>[];
  if (!operations) return defaults;

  const resolved =
    typeof operations === 'function' ? operations([...defaults]) : operations;
  return resolved.length ? resolved : defaults;
}

/* A chip cannot show an operator its column does not offer, so such a filter is
   dropped: it never reaches the rows or the server. A column that sets no
   operations keeps whatever the query carries. */
export function dropDisallowedFilters<Filter extends OperatorFilter>(
  filters: Filter[],
  fields: OperationField[]
): Filter[] {
  const fieldByName = new Map<unknown, OperationField>();
  for (const field of fields) {
    if (!fieldByName.has(field.accessorKey)) {
      fieldByName.set(field.accessorKey, field);
    }
  }

  // Each column resolves once, however many filters it carries.
  const allowedByName = new Map<string, Set<FilterOperatorTypes> | null>();

  return filters.filter(filter => {
    if (!allowedByName.has(filter.name)) {
      const field = fieldByName.get(filter.name);
      allowedByName.set(
        filter.name,
        field?.filterOperations
          ? new Set(
              resolveFilterOperations(
                field.filterType,
                field.filterOperations
              ).map(operation => operation.value)
            )
          : null
      );
    }

    const allowed = allowedByName.get(filter.name);
    if (!allowed) return true;
    // The empty option of a select sends `empty`, which no filter type lists.
    return filter.operator === 'empty' || allowed.has(filter.operator);
  });
}
