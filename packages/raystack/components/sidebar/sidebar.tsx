import { SidebarItem } from './sidebar-item';
import { SidebarMain } from './sidebar-main';
import {
  SidebarFooter,
  SidebarHeader,
  SidebarNavigationGroup
} from './sidebar-misc';
import { SidebarRoot } from './sidebar-root';

export const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Main: SidebarMain,
  Footer: SidebarFooter,
  Item: SidebarItem,
  Group: SidebarNavigationGroup
});
