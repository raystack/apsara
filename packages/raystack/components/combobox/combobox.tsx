import { ComboboxContent } from './combobox-content';
import { ComboboxInput } from './combobox-input';
import { ComboboxItem } from './combobox-item';
import {
  ComboboxGroup,
  ComboboxLabel,
  ComboboxSeparator
} from './combobox-misc';
import { ComboboxRoot } from './combobox-root';

export const Combobox = Object.assign(ComboboxRoot, {
  Input: ComboboxInput,
  Content: ComboboxContent,
  Item: ComboboxItem,
  Group: ComboboxGroup,
  Label: ComboboxLabel,
  Separator: ComboboxSeparator
});
