import type { FilterFn } from '@tanstack/table-core';

import type { DateFilterOperatorType, FilterValue } from '~/types/filters';
import {
  isAfterDay,
  isBeforeDay,
  isSameDay,
  toDateLoose
} from './date-adapter';

/**
 * The date filter operators, once.
 *
 * Sited beside the adapter rather than under `shared/`: both `DataTable` and
 * `DataView` already import `date-adapter` from here, so this adds no new
 * dependency edge, whereas `shared/` is a leaf that components depend on and
 * must not depend back on one. Kept out of `date-adapter` itself so a tanstack
 * `FilterFn` never becomes part of the calendar's date surface.
 *
 * `DataTable` and `DataView` each had their own copy — same six operators, same
 * predicates, differing only in arrow style and an unused `_addMeta`. Both
 * already type them as `FilterFn<unknown>` from tanstack and read `date` off
 * the same `FilterValue`, so nothing about the duplication was load-bearing; it
 * simply meant every fix here had to be made twice, and the epoch-seconds fix
 * was made twice by hand.
 *
 * Date comparisons go through the calendar adapter, which is the one place that
 * registers dayjs plugins. Extending them here as well made the module
 * order-dependent — the failure class behind the 0.49.0 P0.
 *
 * A row value that will not parse compares false against every operator that
 * asserts a relationship, which is what an unfilterable cell should do. `neq`
 * is the exception, and deliberately: it negates `eq`, so an empty or
 * unparseable cell is "not equal to" any date and survives the filter. That
 * matches the behaviour the old operators had.
 */
const compare = (
  a: unknown,
  b: unknown,
  predicate: (left: Date, right: Date) => boolean
) => {
  const left = toDateLoose(a);
  const right = toDateLoose(b);
  return left && right ? predicate(left, right) : false;
};

const on =
  (predicate: (left: Date, right: Date) => boolean): FilterFn<unknown> =>
  (row, columnId, filterValue: FilterValue) =>
    compare(row.getValue(columnId), filterValue.date, predicate);

export const dateFilterOperations: Record<
  DateFilterOperatorType,
  FilterFn<unknown>
> = {
  eq: on(isSameDay),
  neq: (row, columnId, filterValue: FilterValue) =>
    !compare(row.getValue(columnId), filterValue.date, isSameDay),
  lt: on(isBeforeDay),
  lte: on((a, b) => !isAfterDay(a, b)),
  gt: on(isAfterDay),
  gte: on((a, b) => !isBeforeDay(a, b))
};
