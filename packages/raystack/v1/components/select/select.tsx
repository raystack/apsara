import * as SelectPrimitive from "@radix-ui/react-select";
import { SelectTrigger } from "./select-trigger";
import { SelectContent } from "./select-content";
import { SelectItem } from "./select-item";
import { SelectValue } from "./select-value";
import { SelectRoot } from "./select-root";

export const Select = Object.assign(SelectRoot, {
  Group: SelectPrimitive.Group,
  Value: SelectValue,
  ScrollUpButton: SelectPrimitive.ScrollDownButton,
  ScrollDownButton: SelectPrimitive.ScrollDownButton,
  Viewport: SelectPrimitive.Viewport,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Separator: SelectPrimitive.Separator,
});
