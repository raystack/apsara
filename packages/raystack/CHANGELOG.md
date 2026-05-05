# @raystack/apsara

## 0.12.0

### Minor Changes

- <hash>: tighten `DataTableFilterValues.value` from `any` to `unknown`. Consumers reading `filter.value` directly (e.g. into a typed slot) will need to narrow or cast — for example:

  ```ts
  // Before
  <Input value={filter.value} />

  // After
  <Input value={filter.value as string} />
  ```

  Runtime behavior is unchanged. The type was always polymorphic across column types (`string | string[] | number | boolean | Date`); `any` silently allowed mismatches, `unknown` makes the narrowing explicit.

### Patch Changes

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
