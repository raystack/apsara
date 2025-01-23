import { MagnifyingGlassIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { ReactNode } from "react";
import styles from "./search.module.css";

export interface SearchProps {
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  size?: "small" | "large";
  showClearButton?: boolean;
  onClear?: () => void;
  value?: string;
  ref?: React.RefObject<HTMLInputElement>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  type?: string;
  name?: string;
  id?: string;
}

export const Search = ({ 
  className, 
  disabled, 
  placeholder = "Search", 
  size = "large", 
  showClearButton, 
  onClear, 
  value,
  ref,
  ...props 
}: SearchProps) => {
  return (
    <div className={styles.container} role="search">
      <div className={styles.inputWrapper}>
        <span className={styles.leadingIcon} aria-hidden="true">
          <MagnifyingGlassIcon />
        </span>
        <input
          ref={ref}
          type="text"
          className={clsx(
            styles.searchField,
            styles[`search-${size}`],
            disabled && styles["search-disabled"],
            className
          )}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          aria-label={placeholder}
          {...props}
        />
        {showClearButton && value && (
          <button 
            className={styles.clearButton}
            onClick={onClear}
            disabled={disabled}
            type="button"
            aria-label="Clear search"
            tabIndex={0}
          >
            <CrossCircledIcon />
          </button>
        )}
      </div>
    </div>
  );
};

Search.displayName = "Search"; 