import { Select as SelectPrimitive } from 'radix-ui';
import { SelectContent } from './select-content';
import { SelectItem } from './select-item';
import { SelectGroup, SelectLabel, SelectSeparator } from './select-misc';
import { SelectRoot } from './select-root';
import { SelectTrigger } from './select-trigger';
import { SelectValue } from './select-value';

export const Select = Object.assign(SelectRoot, {
  Group: SelectGroup,
  Value: SelectValue,
  ScrollUpButton: SelectPrimitive.ScrollDownButton,
  ScrollDownButton: SelectPrimitive.ScrollDownButton,
  Viewport: SelectPrimitive.Viewport,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Separator: SelectSeparator,
  Label: SelectLabel
});
