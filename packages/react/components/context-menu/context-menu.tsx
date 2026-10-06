import {
  ContextMenuContent,
  ContextMenuSubContent
} from './context-menu-content';
import { ContextMenuItem } from './context-menu-item';
import {
  ContextMenuEmptyState,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator
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
  Group: ContextMenuGroup,
  Label: ContextMenuLabel,
  Separator: ContextMenuSeparator,
  EmptyState: ContextMenuEmptyState,
  Submenu: ContextMenuSubMenu,
  SubmenuTrigger: ContextMenuSubTrigger,
  SubmenuContent: ContextMenuSubContent
});
