'use client';

import { createContext, ReactNode, useContext } from 'react';

interface SidebarMoreContextValue {
  isInsideSidebarMore: boolean;
  menuItemClassName?: string;
}

const SidebarMoreContext = createContext<SidebarMoreContextValue | undefined>(
  undefined
);

export function SidebarMoreProvider({
  value,
  children
}: {
  value: SidebarMoreContextValue;
  children: ReactNode;
}) {
  return (
    <SidebarMoreContext.Provider value={value}>
      {children}
    </SidebarMoreContext.Provider>
  );
}

export function useSidebarMoreContext() {
  return useContext(SidebarMoreContext);
}
