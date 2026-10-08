import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { ComboboxContent } from './combobox-content';
import { ComboboxInput } from './combobox-input';
import { ComboboxItem } from './combobox-item';
import { createItems } from './combobox-items';
import {
  ComboboxClear,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxLabel,
  ComboboxSeparator,
  ComboboxStatus
} from './combobox-misc';
import { ComboboxRoot } from './combobox-root';

export const Combobox = Object.assign(ComboboxRoot, {
  Input: ComboboxInput,
  Content: ComboboxContent,
  Item: ComboboxItem,
  Label: ComboboxLabel,
  Clear: ComboboxClear,
  Empty: ComboboxEmpty,
  Status: ComboboxStatus,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Separator: ComboboxSeparator,
  useFilter: ComboboxPrimitive.useFilter,
  useFilteredItems: ComboboxPrimitive.useFilteredItems,
  createItems
});
