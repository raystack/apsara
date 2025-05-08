import { forwardRef, HTMLAttributes, useMemo } from "react";
import { Slot } from "@radix-ui/react-slot";
import { AlignExtendedType, AlignType } from "./types";

const GAPS = {
  "extra-small": "var(--rs-space-2)",
  small: "var(--rs-space-3)",
  medium: "var(--rs-space-5)",
  large: "var(--rs-space-9)",
  "extra-large": "var(--rs-space-11)",
} as const;

type GapType = keyof typeof GAPS;

type GridProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Supports CSS Grid template areas syntax.
   *
   * @example
   * <Grid templateAreas="header header header" />
   * <Grid templateAreas={["header header header", "sidebar main main", "footer footer footer"]} />
   */
  templateAreas?: string | string[];
  autoFlow?: "row" | "column" | "dense" | "row dense" | "column dense";
  autoColumns?: string;
  autoRows?: string;

  /**
   * Supports CSS Grid template columns syntax.
   *
   * If you pass a number, columns will be created using repeat(n, 1fr).
   *
   * @example
   * <Grid columns="1fr 1fr 1fr" />
   * <Grid columns={3} />
   */
  columns?: string | number;

  /**
   * Supports CSS Grid template rows syntax.
   *
   * If you pass a number, rows will be created using repeat(n, 1fr).
   *
   * @example
   * <Grid rows="1fr 1fr 1fr" />
   * <Grid rows={3} />
   */
  rows?: string | number;
  gap?: GapType;
  columnGap?: GapType;
  rowGap?: GapType;
  justifyItems?: AlignType;
  alignItems?: AlignType;
  justifyContent?: AlignExtendedType;
  alignContent?: AlignExtendedType;
  inline?: boolean;
  asChild?: boolean;
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      templateAreas,
      autoFlow,
      autoColumns,
      autoRows,
      columns,
      rows,
      gap,
      columnGap,
      rowGap,
      justifyItems,
      alignItems,
      justifyContent,
      alignContent,
      inline = false,
      style = {},
      asChild,
      ...props
    },
    ref,
  ) => {
    const gridTemplateColumns =
      typeof columns === "number" ? `repeat(${columns}, 1fr)` : columns;
    const gridTemplateRows =
      typeof rows === "number" ? `repeat(${rows}, 1fr)` : rows;

    const gridTemplateAreas = useMemo(() => {
      if (Array.isArray(templateAreas)) {
        return templateAreas
          .map(area => `"${area}"`)
          .join(" ")
          .trim();
      }
      return templateAreas;
    }, [templateAreas]);

    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        style={{
          display: inline ? "inline-grid" : "grid",
          gridTemplateAreas,
          gridAutoFlow: autoFlow,
          gridAutoColumns: autoColumns,
          gridAutoRows: autoRows,
          gridTemplateColumns,
          gridTemplateRows,
          gap: gap && GAPS[gap],
          columnGap: columnGap && GAPS[columnGap],
          rowGap: rowGap && GAPS[rowGap],
          justifyItems,
          alignItems,
          justifyContent,
          alignContent,
          ...style,
        }}
        {...props}
      />
    );
  },
);

Grid.displayName = "Grid";
