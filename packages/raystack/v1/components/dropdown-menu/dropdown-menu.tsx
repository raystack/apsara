import { DropdownMenuRoot, DropdownMenuSubMenu } from "./dropdown-menu-root";
import {
  DropdownMenuContent,
  DropdownMenuSubMenuContent,
} from "./dropdown-menu-content";
import {
  DropdownMenuSubMenuTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu-trigger";
import {
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./dropdown-menu-item";
import {
  DropdownMenuEmptyState,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./dropdown-menu-misc";

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Group: DropdownMenuGroup,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  EmptyState: DropdownMenuEmptyState,
  SubMenu: DropdownMenuSubMenu,
  SubMenuContent: DropdownMenuSubMenuContent,
  SubMenuTrigger: DropdownMenuSubMenuTrigger,
  RadioItem: DropdownMenuRadioItem,
  RadioGroup: DropdownMenuRadioGroup,
});
