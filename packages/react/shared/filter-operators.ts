import type {
  FilterOperator,
  FilterOperatorTypes,
  FilterTypes
} from '~/types/filters';
import { FilterType, filterOperators } from '~/types/filters';

type OperatorField = {
  accessorKey?: unknown;
  filterType?: FilterTypes;
  filterOperators?: FilterOperatorTypes[];
};

type OperatorFilter = {
  name: string;
  operator: FilterOperatorTypes;
};

/**
 * The operators a column offers, in the order `allowed` lists them. A value the
 * filter type does not have is ignored, and a list that leaves nothing falls
 * back to the type's own operators, since a chip needs one operator to filter
 * with.
 */
export function resolveFilterOperators(
  filterType: FilterTypes = FilterType.string,
  allowed?: FilterOperatorTypes[]
): FilterOperator<FilterOperatorTypes>[] {
  const defaults = filterOperators[
    filterType
  ] as FilterOperator<FilterOperatorTypes>[];
  if (!allowed?.length) return defaults;

  const picked: FilterOperator<FilterOperatorTypes>[] = [];
  for (const value of allowed) {
    const operator = defaults.find(option => option.value === value);
    if (operator && !picked.includes(operator)) picked.push(operator);
  }
  return picked.length ? picked : defaults;
}

/* A chip cannot show an operator its column does not offer, so such a filter is
   dropped: it never reaches the rows or the server. A column that lists no
   operators keeps whatever the query carries. */
export function dropDisallowedFilters<Filter extends OperatorFilter>(
  filters: Filter[],
  fields: OperatorField[]
): Filter[] {
  return filters.filter(filter => {
    const field = fields.find(f => f.accessorKey === filter.name);
    if (!field?.filterOperators?.length) return true;
    return resolveFilterOperators(field.filterType, field.filterOperators).some(
      operator => operator.value === filter.operator
    );
  });
}
