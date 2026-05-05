# @raystack/apsara

## 0.12.0

### Minor Changes

- <hash>: tighten `DataTableFilterValues.value` from `any` to `unknown`. Consumers reading `filter.value` directly (e.g. into a typed slot) will need to narrow or cast to the appropriate union for their `columnType`. Example for code that mixes filter types:

  ```tsx
  // Before
  <FilterChip value={filter.value} />

  // After (cast to the runtime union)
  <FilterChip value={filter.value as string | string[] | number | Date} />
  ```

  Runtime behavior is unchanged. The type was always polymorphic across column types (`string | string[] | number | boolean | Date`); `any` silently allowed mismatches, `unknown` makes the narrowing explicit.

### Patch Changes

- <hash>: widen `FilterChip.value` from `string` to `string | string[] | number | Date` to match the runtime values produced per `columnType` (single-select/string → `string`; multiselect → `string[]`; number → `number`; date → `Date`). Existing callers passing `string` are unaffected; consumers extracting the prop type and using it in their own code may now need to narrow.

- <hash>: change `useDebouncedState`'s default generic from `T = any` to `T = unknown`. The default applies only when `defaultValue` cannot be inferred (rare in practice). Callers who relied on `any`'s permissiveness without specifying `T` may need to add an explicit type argument or narrow at the use site.

## 0.11.3

### Patch Changes

- 18254e1: export select scroll buttons

## 0.11.2

### Patch Changes

- 8eaeaec: fix: select options font color

## 0.11.1

### Patch Changes

- 9057c8c: fix: show more than 10 columns in table.

## 0.11.0

### Minor Changes

- 1375394: fix: table style
