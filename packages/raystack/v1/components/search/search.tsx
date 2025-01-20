import { MagnifyingGlassIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import styles from "./search.module.css";

export interface SearchProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  size?: "small" | "large";
  showClearButton?: boolean;
  onClear?: () => void;
}

export const Search = forwardRef<ElementRef<"input">, SearchProps>(
  ({ className, disabled, placeholder = "Search", size = "large", showClearButton, onClear, value, ...props }, ref) => {
    return (
      <div className={styles.container} role="search">
        <div className={styles.inputWrapper}>
          <span className={styles.leadingIcon} aria-hidden="true">
            <MagnifyingGlassIcon />
          </span>
          <input
            ref={ref}
            type="search"
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
  }
);

Search.displayName = "Search"; 