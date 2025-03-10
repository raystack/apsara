import { CrossCircledIcon,MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { ReactNode } from "react";

import styles from "./search.module.css";

const searchField = cva(styles.searchField, {
  variants: {
    size: {
      small: styles["search-small"],
      large: styles["search-large"],
    }
  },
  defaultVariants: {
    size: "large",
  }
});

export interface SearchProps extends VariantProps<typeof searchField> {
  className?: string;
  disabled?: boolean;
  placeholder?: string;
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
  size, 
  showClearButton, 
  onClear, 
  value,
  ref,
  ...props 
}: SearchProps) => {
  return (
    <div 
      className={clsx(styles.container, disabled && styles.disabled)} 
      role="search"
    >
      <span className={styles.leadingIcon} aria-hidden="true">
        <MagnifyingGlassIcon />
      </span>
      <input
        ref={ref}
        type="text"
        className={clsx(
          searchField({ size, className }),
          disabled && styles["search-disabled"]
        )}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        aria-label={placeholder}
        {...props}
      />
      {showClearButton && value && !disabled && (
        <button 
          className={styles.clearButton}
          onClick={onClear}
          disabled={disabled}
          type="button"
          aria-label="Clear search"
          tabIndex={0}
        >
          <CrossCircledIcon height={16} width={16}/>
        </button>
      )}
    </div>
  );
};

Search.displayName = "Search";