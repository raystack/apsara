import { Cross1Icon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
import { Box } from "../box";
import { Flex } from "../flex";
import { Text } from "../text";
import styles from "./filter-chip.module.css";

export interface FilterChipProps {
  label: string;
  value?: string;
  onRemove?: () => void;
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
  children?: ReactNode;
}

export const FilterChip = ({
  label,
  value,
  onRemove,
  className,
  ref,
  ...props
}: FilterChipProps) => {
  return (
    <Box
      ref={ref}
      className={[styles.chip, className].filter(Boolean).join(" ")}
      {...props}
    >
      <Flex gap="small" align="center">
        <Text size={2} weight="normal">
          {label}
        </Text>
        {value && (
          <>
            <Text size={2} color="secondary">
              is
            </Text>
            <Text size={2} weight="normal">
              {value}
            </Text>
          </>
        )}
        {onRemove && (
          <Cross1Icon 
            className={styles.removeIcon}
            height="12" 
            width="12" 
            onClick={onRemove}
            aria-label="Remove filter"
          />
        )}
      </Flex>
    </Box>
  );
};

FilterChip.displayName = "FilterChip";
