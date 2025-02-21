import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";
import styles from "./table.module.css";

const table = cva(styles.table);
/**
 * @deprecated Use Table from '@raystack/apsara/v1' instead.
 */
const TableRoot = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> &
    React.PropsWithChildren<VariantProps<typeof table>>
>(({ className, ...props }, ref) => (
  <div style={{ width: "100%", overflow: "auto" }}>
    <table ref={ref} className={table({ className })} {...props} />
  </div>
));
TableRoot.displayName = "Table";

const header = cva(styles.header);
/**
 * @deprecated Use Table from '@raystack/apsara/v1' instead.
 */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> &
    React.PropsWithChildren<VariantProps<typeof header>>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={header({ className })} {...props} />
));
TableHeader.displayName = "TableHeader";

const body = cva(styles.body);
/**
 * @deprecated Use Table from '@raystack/apsara/v1' instead.
 */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> &
    React.PropsWithChildren<VariantProps<typeof body>>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={body({ className })} {...props} />
));
TableBody.displayName = "TableBody";

const footer = cva(styles.footer);
/**
 * @deprecated TableFooter is removed and no longer supported in `@raystack/apsara/v1`
 */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> &
    React.PropsWithChildren<VariantProps<typeof footer>>
>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={footer({ className })} {...props} />
));
TableFooter.displayName = "TableFooter";

const row = cva(styles.row);
/**
 * @deprecated Use Table from '@raystack/apsara/v1' instead.
 */
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> &
    React.PropsWithChildren<VariantProps<typeof row>>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={row({ className })} {...props} />
));
TableRow.displayName = "TableRow";

const head = cva(styles.head);
/**
 * @deprecated Use Table from '@raystack/apsara/v1' instead.
 */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> &
    React.PropsWithChildren<VariantProps<typeof head>>
>(({ className, ...props }, ref) => (
  <th ref={ref} className={head({ className })} {...props} />
));
TableHead.displayName = "TableHead";

const cell = cva(styles.cell);
/**
 * @deprecated Use Table from '@raystack/apsara/v1' instead.
 */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> &
    React.PropsWithChildren<VariantProps<typeof head>>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cell({ className })} {...props} />
));
TableCell.displayName = "TableCell";

const caption = cva(styles.caption);
/**
 * @deprecated TableCaption is removed and no longer supported in `@raystack/apsara/v1`
 */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={caption({ className })} {...props} />
));
TableCaption.displayName = "TableCaption";

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Head: TableHead,
  Row: TableRow,
  Cell: TableCell,
  Caption: TableCaption,
});
