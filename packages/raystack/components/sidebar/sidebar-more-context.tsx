'use client';

import { createContext, useContext } from 'react';

// True for items rendered inside a Sidebar.More menu, where Sidebar.Item
// renders as a Menu.Item instead of a nav link. Lives in its own file so
// sidebar-item and sidebar-more don't have to import each other.
export const SidebarMoreContext = createContext(false);

export function useInsideSidebarMore(): boolean {
  return useContext(SidebarMoreContext);
}
