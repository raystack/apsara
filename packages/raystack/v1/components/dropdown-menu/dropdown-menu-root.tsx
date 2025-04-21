import { MenuProvider, MenuProviderProps } from "@ariakit/react";

export interface DropdownMenuRootProps extends MenuProviderProps {}

export const DropdownMenuRoot = (props: DropdownMenuRootProps) => (
  <MenuProvider {...props} />
);
