import { SidebarFooter } from './sidebar-footer';
import { SidebarNavigationGroup } from './sidebar-group';
import { SidebarHeader } from './sidebar-header';
import { SidebarItem } from './sidebar-item';
import { SidebarMain } from './sidebar-main';
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
