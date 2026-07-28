import { SidebarItem } from './sidebar-item';
import { SidebarMain } from './sidebar-main';
import {
  SidebarFooter,
  SidebarHeader,
  SidebarNavigationGroup
} from './sidebar-misc';
import { SidebarMore } from './sidebar-more';
import { SidebarRoot } from './sidebar-root';
import { SidebarTrigger } from './sidebar-trigger';

export const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Main: SidebarMain,
  Footer: SidebarFooter,
  Item: SidebarItem,
  Group: SidebarNavigationGroup,
  More: SidebarMore,
  Trigger: SidebarTrigger
});
