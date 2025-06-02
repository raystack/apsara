import * as SelectPrimitive from '@radix-ui/react-select';
import { ReactNode } from 'react';

export type ItemType = {
  leadingIcon?: ReactNode;
  children: ReactNode;
  value: string;
};

interface CommonProps {
  autocomplete?: boolean;
  autocompleteMode?: 'auto' | 'manual';
  searchValue?: string;
  onSearch?: (value: string) => void;
  defaultSearchValue?: string;
}

export interface SelectContextValue extends CommonProps {
  value?: string | string[];
  registerItem: (item: ItemType) => void;
  unregisterItem: (value: string) => void;
  multiple: boolean;
  items: Record<string, ItemType>;
  updateSelectionInProgress: (value: boolean) => void;
  setValue: (value: string) => void;
}

export interface UseSelectContext extends SelectContextValue {
  shouldFilter?: boolean;
}

interface NormalSelectRootProps extends SelectPrimitive.SelectProps {
  autocomplete?: false;
  autocompleteMode?: never;
  searchValue?: never;
  onSearch?: never;
  defaultSearchValue?: never;
}

interface AutocompleteSelectRootProps
  extends SelectPrimitive.SelectProps,
    CommonProps {
  autocomplete: true;
}

type BaseSelectProps = Omit<
  NormalSelectRootProps | AutocompleteSelectRootProps,
  'autoComplete' | 'value' | 'onValueChange' | 'defaultValue'
> & {
  htmlAutoComplete?: string;
};

export interface SingleSelectProps extends BaseSelectProps {
  multiple?: false;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

export interface MultipleSelectProps extends BaseSelectProps {
  multiple: true;
  value?: string[];
  onValueChange?: (value: string[]) => void;
  defaultValue?: string[];
}

export type SelectRootProps = SingleSelectProps | MultipleSelectProps;
