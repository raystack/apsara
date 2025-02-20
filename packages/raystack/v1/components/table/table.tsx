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

const TableHeader = React.forwardRef<HTMLTableSectionElement>(
  ({ ...props }, ref) => {
    return <thead ref={ref} {...props} />;
  }
);

const TableBody = React.forwardRef<HTMLTableSectionElement>(
  ({ ...props }, ref) => {
    return <tbody ref={ref} {...props} />;
  }
);

const TableFooter = React.forwardRef<HTMLTableSectionElement>(
  ({ ...props }, ref) => {
    return <tfoot ref={ref} {...props} />;
  }
);

const TableRow = React.forwardRef<HTMLTableRowElement>(({ ...props }, ref) => {
  return <tr ref={ref} {...props} />;
});

const TableHead = React.forwardRef<HTMLTableCellElement>(
  ({ ...props }, ref) => {
    return <th ref={ref} {...props} />;
  }
);

const TableCell = React.forwardRef<HTMLTableCellElement>(
  ({ ...props }, ref) => {
    return <td ref={ref} {...props} />;
  }
);

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
});
