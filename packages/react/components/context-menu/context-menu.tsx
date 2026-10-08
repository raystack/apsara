import {
  ContextMenuContent,
  ContextMenuSubContent
} from './context-menu-content';
import {
  ContextMenuCheckboxItem,
  ContextMenuItem,
  ContextMenuLinkItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem
} from './context-menu-item';
import {
  ContextMenuEmptyState,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuStatus
} from './context-menu-misc';
import { ContextMenuRoot, ContextMenuSubMenu } from './context-menu-root';
import {
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from './context-menu-trigger';

export const ContextMenu = Object.assign(ContextMenuRoot, {
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  LinkItem: ContextMenuLinkItem,
  Group: ContextMenuGroup,
  Label: ContextMenuLabel,
  Separator: ContextMenuSeparator,
  EmptyState: ContextMenuEmptyState,
  Status: ContextMenuStatus,
  Submenu: ContextMenuSubMenu,
  SubmenuTrigger: ContextMenuSubTrigger,
  SubmenuContent: ContextMenuSubContent
});
