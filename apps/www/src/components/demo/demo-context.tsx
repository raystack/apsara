'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

export const DemoContext = createContext<{
  openPlayground: boolean;
  setOpenPlayground: (open: boolean) => void;
  hasPlayground: boolean;
  title: string;
}>({
  openPlayground: false,
  setOpenPlayground: () => null,
  hasPlayground: false,
  title: ''
});

export const DemoContextProvider = ({
  children,
  hasPlayground,
  title
}: {
  children: ReactNode;
  hasPlayground: boolean;
  title: string;
}) => {
  const [openPlayground, setOpenPlayground] = useState(false);
  return (
    <DemoContext.Provider
      value={{ openPlayground, setOpenPlayground, hasPlayground, title }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoContext = () => {
  return useContext(DemoContext);
};
