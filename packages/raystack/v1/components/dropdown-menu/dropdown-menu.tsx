import { DropdownMenuRoot } from "./dropdown-menu-root";
import { DropdownMenuContent } from "./dropdown-menu-content";
import { DropdownMenuItem } from "./dropdown-menu-item";
import {
  DropdownMenuTrigger,
  DropdownMenuTriggerItem,
} from "./dropdown-menu-trigger";
import {
  DropdownMenuEmptyState,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./dropdown-menu-misc";

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  /**
   * `TriggerItem` is a helper component that renders a `Trigger` as a `MenuItem`.
   */
  TriggerItem: DropdownMenuTriggerItem,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Group: DropdownMenuGroup,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  EmptyState: DropdownMenuEmptyState,
});
