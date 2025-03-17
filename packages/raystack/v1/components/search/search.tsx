import { CrossCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { InputField } from "../input-field";
import { InputFieldProps } from "../input-field/input-field";

import styles from "./search.module.css";

export interface SearchProps extends Omit<InputFieldProps, 'leadingIcon'> {
  showClearButton?: boolean;
  onClear?: () => void;
}

export const Search = ({ 
  className, 
  disabled, 
  placeholder = "Search", 
  size, 
  showClearButton, 
  onClear, 
  value,
  onChange,
  width = "100%",
  ...props 
}: SearchProps) => {
  return (
    <div className={styles.container} role="search" style={{ width }}>
      <InputField
        leadingIcon={<MagnifyingGlassIcon />}
        trailingIcon={showClearButton && value ? (
          <div 
            className={styles.clearButton}
            role="button"
            aria-label="Clear search"
            tabIndex={0}
          >
            <CrossCircledIcon onClick={disabled ? undefined : onClear} />
          </div>
        ) : undefined}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        size={size}
        className={className}
        aria-label={placeholder}
        {...props}
      />
    </div>
  );
};

Search.displayName = "Search"; 