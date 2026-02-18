import { MenuContent, MenuSubContent } from './menu-content';
import { MenuItem } from './menu-item';
import {
  MenuEmptyState,
  MenuGroup,
  MenuLabel,
  MenuSeparator
} from './menu-misc';
import { MenuRoot, MenuSubMenu } from './menu-root';
import { MenuSubTrigger, MenuTrigger } from './menu-trigger';

export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  Group: MenuGroup,
  Label: MenuLabel,
  Separator: MenuSeparator,
  EmptyState: MenuEmptyState,
  Submenu: MenuSubMenu,
  SubmenuTrigger: MenuSubTrigger,
  SubmenuContent: MenuSubContent
});
