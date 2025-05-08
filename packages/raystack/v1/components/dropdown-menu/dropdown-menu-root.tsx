import {
  ComboboxProvider,
  MenuProvider,
  MenuProviderProps,
} from "@ariakit/react";
import { createContext, useContext, useState } from "react";

interface CommonProps {
  autocomplete?: boolean;
  autocompleteMode?: "auto" | "manual";
  searchValue?: string;
}

interface DropdownContextValue extends CommonProps {
  parent?: CommonProps;
}

interface UseDropdownContext extends DropdownContextValue {
  shouldFilter?: boolean;
  parent?: CommonProps & {
    shouldFilter?: boolean;
  };
}

/**
 Root context to manage the Dropdown control
 @remarks Only for internal usage.
 */

export const DropdownContext = createContext<DropdownContextValue | undefined>(
  undefined,
);

export const useDropdownContext = (): UseDropdownContext => {
  const context = useContext(DropdownContext);
  if (!context) return {};

  const shouldFilter = !!(
    context?.autocomplete &&
    context?.autocompleteMode === "auto" &&
    context?.searchValue?.length
  );

  const shouldFilterParent = !!(
    context?.parent?.autocomplete &&
    context?.parent?.autocompleteMode === "auto" &&
    context?.parent?.searchValue?.length
  );

  return {
    ...context,
    shouldFilter,
    parent: context?.parent && {
      ...context.parent,
      shouldFilter: shouldFilterParent,
    },
  };
};

export interface NormalDropdownMenuRootProps extends MenuProviderProps {
  autocomplete?: false;
  autocompleteMode?: never;
  searchValue?: never;
  onSearch?: never;
  defaultSearchValue?: never;
}

export interface AutocompleteDropdownMenuRootProps
  extends MenuProviderProps,
    CommonProps {
  autocomplete: true;
  onSearch?: (value: string) => void;
  defaultSearchValue?: string;
}

export type DropdownMenuRootProps =
  | NormalDropdownMenuRootProps
  | AutocompleteDropdownMenuRootProps;

export const DropdownMenuRoot = ({
  autocomplete,
  autocompleteMode = "auto",
  searchValue: providedSearchValue,
  onSearch,
  focusLoop = true,
  defaultSearchValue = "",
  ...props
}: DropdownMenuRootProps) => {
  const [internalSearchValue, setInternalSearchValue] =
    useState(defaultSearchValue);
  const dropdownContext = useDropdownContext();

  const searchValue = providedSearchValue ?? internalSearchValue;

  const setValue = (value: string) => {
    setInternalSearchValue(value);
    onSearch?.(value);
  };

  const element = <MenuProvider focusLoop={focusLoop} {...props} />;

  return (
    <DropdownContext.Provider
      value={{
        autocomplete,
        parent: dropdownContext,
        autocompleteMode,
        searchValue,
      }}>
      {autocomplete ? (
        <ComboboxProvider
          resetValueOnHide
          focusLoop={focusLoop}
          includesBaseElement={false}
          value={searchValue}
          setValue={setValue}>
          {element}
        </ComboboxProvider>
      ) : (
        element
      )}
    </DropdownContext.Provider>
  );
};
