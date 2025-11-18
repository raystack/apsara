'use client';

import { ReactNode, createContext, useContext } from 'react';

const PreContext = createContext<{
  hasPreParent: boolean;
}>({
  hasPreParent: false
});

export const PreContextProvider = ({
  children,
  hasPreParent
}: { children: ReactNode; hasPreParent: boolean }) => {
  return (
    <PreContext.Provider value={{ hasPreParent }}>
      {children}
    </PreContext.Provider>
  );
};

export const usePreContext = () => {
  return useContext(PreContext);
};
