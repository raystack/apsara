import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import styles from "./table.module.css";

const table = cva(styles["table"]);
const TableRoot = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> &
    React.PropsWithChildren<VariantProps<typeof table>>
>(({ className, ...props }, ref) => {
  return <table ref={ref} {...props} className={table({ className })} />;
});

const header = cva(styles["header"]);
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> &
    React.PropsWithChildren<VariantProps<typeof header>>
>(({ className, ...props }, ref) => {
  return <thead ref={ref} {...props} className={header({ className })} />;
});

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & React.PropsWithChildren
>(({ ...props }, ref) => {
  return <tbody ref={ref} {...props} />;
});

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & React.PropsWithChildren
>(({ ...props }, ref) => {
  return <tr ref={ref} {...props} />;
});

const head = cva(styles["head"]);
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> &
    React.PropsWithChildren<VariantProps<typeof head>>
>(({ className, ...props }, ref) => {
  return <th ref={ref} {...props} className={head({ className })} />;
});

const cell = cva(styles["cell"]);
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> &
    React.PropsWithChildren<VariantProps<typeof cell>>
>(({ className, ...props }, ref) => {
  return <td ref={ref} {...props} className={cell({ className })} />;
});

const sectionHeader = cva(styles["sectionHeader"]);
type SectionHeaderClassNames = "row" | "cell";
const SectionHeader = React.forwardRef<
  HTMLTableRowElement,
  React.PropsWithChildren & {
    colSpan: number;
    classNames?: Partial<Record<SectionHeaderClassNames, string>>;
  }
>(({ classNames, colSpan, children }, ref) => {
  return (
    <tr ref={ref} className={sectionHeader({ className: classNames?.row })}>
      <th colSpan={colSpan} className={classNames?.cell}>
        {children}
      </th>
    </tr>
  );
});

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  SectionHeader: SectionHeader,
});
