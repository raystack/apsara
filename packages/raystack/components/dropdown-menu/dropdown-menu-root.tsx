'use client';

import {
  ComboboxProvider,
  MenuProvider,
  MenuProviderProps
} from '@ariakit/react';
import { createContext, useCallback, useContext, useState } from 'react';

interface CommonProps {
  autocomplete?: boolean;
  autocompleteMode?: 'auto' | 'manual';
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
  undefined
);

export const useDropdownContext = (): UseDropdownContext => {
  const context = useContext(DropdownContext);
  if (!context) return {};

  const shouldFilter = !!(
    context?.autocomplete &&
    context?.autocompleteMode === 'auto' &&
    context?.searchValue?.length
  );

  const shouldFilterParent = !!(
    context?.parent?.autocomplete &&
    context?.parent?.autocompleteMode === 'auto' &&
    context?.parent?.searchValue?.length
  );

  return {
    ...context,
    shouldFilter,
    parent: context?.parent && {
      ...context.parent,
      shouldFilter: shouldFilterParent
    }
  };
};

export interface BaseMenuProviderProps
  extends Omit<MenuProviderProps, 'setOpen'> {
  onOpenChange?: MenuProviderProps['setOpen'];
}

export interface NormalDropdownMenuRootProps extends BaseMenuProviderProps {
  autocomplete?: false;
  autocompleteMode?: never;
  searchValue?: never;
  onSearch?: never;
  defaultSearchValue?: never;
}

export interface AutocompleteDropdownMenuRootProps
  extends BaseMenuProviderProps,
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
  autocompleteMode = 'auto',
  searchValue: providedSearchValue,
  onSearch,
  focusLoop = true,
  defaultSearchValue = '',
  onOpenChange,
  ...props
}: DropdownMenuRootProps) => {
  const [internalSearchValue, setInternalSearchValue] =
    useState(defaultSearchValue);
  const dropdownContext = useDropdownContext();

  const searchValue = providedSearchValue ?? internalSearchValue;

  const setValue = useCallback(
    (value: string) => {
      setInternalSearchValue(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const element = (
    <MenuProvider focusLoop={focusLoop} setOpen={onOpenChange} {...props} />
  );

  return (
    <DropdownContext.Provider
      value={{
        autocomplete,
        parent: dropdownContext,
        autocompleteMode,
        searchValue
      }}
    >
      {autocomplete ? (
        <ComboboxProvider
          resetValueOnHide
          focusLoop={focusLoop}
          includesBaseElement={false}
          value={searchValue}
          setOpen={onOpenChange}
          setValue={setValue}
        >
          {element}
        </ComboboxProvider>
      ) : (
        element
      )}
    </DropdownContext.Provider>
  );
};
