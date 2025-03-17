import { CrossCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { InputField } from "../input-field";
import { InputFieldProps } from "../input-field/input-field";
import { IconButton } from "../icon-button";

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
  const trailingIconWithClear = showClearButton && value ? (
    <div className={styles.clearButtonWrapper}>
      <IconButton
        size={size === 'small' ? 2 : 3}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled && onClear) {
            onClear();
          }
        }}
        disabled={disabled}
        aria-label="Clear search"
        className={styles.clearButton}
      >
        <CrossCircledIcon />
      </IconButton>
    </div>
  ) : undefined;

  return (
    <div className={styles.container} role="search" style={{ width }}>
      <InputField
        leadingIcon={<MagnifyingGlassIcon />}
        trailingIcon={trailingIconWithClear}
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