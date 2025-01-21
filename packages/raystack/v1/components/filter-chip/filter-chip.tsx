import { Cross1Icon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { Box } from "../box";
import { Flex } from "../flex";
import { Text } from "../text";
import styles from "./filter-chip.module.css";

export interface FilterChipProps extends ComponentPropsWithoutRef<"div"> {
  label: string;
  value?: string;
  onRemove?: () => void;
  variant?: "default" | "accent" | "attention" | "success" | "danger";
  operation?: string;
  onOperationChange?: (operation: string) => void;
  onValueChange?: (value: string) => void;
}

export const FilterChip = forwardRef<HTMLDivElement, FilterChipProps>(
  ({
    label,
    value,
    operation,
    onRemove,
    onOperationChange,
    onValueChange,
    variant = "default",
    className,
    ...props 
  }, ref) => {
    return (
      <Box ref={ref} className={styles.chip} data-variant={variant} {...props}>
        <Text className={styles.filterText}>{label}</Text>
        
        {operation && (
          <div className={styles.operation}>
            {operation}
          </div>
        )}

        {value && (
          <div className={styles.value}>
            {value}
          </div>
        )}

        {onRemove && (
          <Flex className={styles.removeButton}>
            <Cross1Icon 
              height="12" 
              width="12" 
              onClick={onRemove}
              aria-label="Remove filter"
            />
          </Flex>
        )}
      </Box>
    );
  }
);

FilterChip.displayName = "FilterChip";
