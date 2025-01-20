import { MagnifyingGlassIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import styles from "./search.module.css";

export interface SearchProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  /**
   * The size of the search input
   * @default "large"
   */
  size?: "small" | "large";
  /**
   * Show clear button in trailing position
   * @default false
   */
  showClearButton?: boolean;
  /**
   * Callback when clear button is clicked
   */
  onClear?: () => void;
}

export const Search = forwardRef<ElementRef<"input">, SearchProps>(
  ({ className, disabled, placeholder = "Search", size = "large", showClearButton, onClear, value, ...props }, ref) => {
    return (
      <div className={styles.container}>
        <div className={styles.inputWrapper}>
          <span className={styles.leadingIcon}>
            <MagnifyingGlassIcon />
          </span>
          <input
            ref={ref}
            className={clsx(
              styles.searchField,
              styles[`search-${size}`],
              disabled && styles["search-disabled"],
              className
            )}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            {...props}
          />
          {showClearButton && value && (
            <button 
              className={styles.clearButton}
              onClick={onClear}
              disabled={disabled}
              type="button"
              aria-label="Clear search"
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