import { Combobox as ComboboxPrimitive } from '@base-ui/react';

type LabelLookup = (value: unknown) => string | undefined;

const labelLookups = new WeakMap<object, LabelLookup>();

/**
 * Wraps Base UI's `createItems` and records how to label each value, so chips
 * can show labels instead of raw values.
 */
export const createItems: typeof ComboboxPrimitive.createItems = (
  data,
  options
) => {
  const collection = ComboboxPrimitive.createItems(data, options);
  labelLookups.set(collection, value => {
    for (const entry of data ?? []) {
      const items =
        typeof entry === 'object' && entry !== null && 'items' in entry
          ? entry.items
          : [entry];
      for (const item of items) {
        if (options.getValue(item) === value) return options.getLabel(item);
      }
    }
    return undefined;
  });
  return collection;
};

/** Returns the label for `value` when `items` came from `createItems`. */
export function getItemLabel(items: unknown, value: unknown) {
  if (typeof items !== 'object' || items === null) return undefined;
  return labelLookups.get(items)?.(value);
}
