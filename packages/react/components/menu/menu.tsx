import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { MenuCheckboxItem } from './menu-checkbox-item';
import { MenuContent, MenuSubContent } from './menu-content';
import { MenuItem } from './menu-item';
import { MenuLinkItem } from './menu-link-item';
import {
  MenuEmptyState,
  MenuGroup,
  MenuLabel,
  MenuSeparator,
  MenuStatus
} from './menu-misc';
import { MenuRadioGroup, MenuRadioItem } from './menu-radio';
import { MenuRoot, MenuSubMenu } from './menu-root';
import { MenuSubTrigger, MenuTrigger } from './menu-trigger';

export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  LinkItem: MenuLinkItem,
  Group: MenuGroup,
  Label: MenuLabel,
  Separator: MenuSeparator,
  EmptyState: MenuEmptyState,
  Status: MenuStatus,
  Submenu: MenuSubMenu,
  SubmenuTrigger: MenuSubTrigger,
  SubmenuContent: MenuSubContent,
  createHandle: MenuPrimitive.createHandle
});
