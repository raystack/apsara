import React from "react";

const TableRoot = React.forwardRef<HTMLTableElement>(({}, ref) => {
  return <table ref={ref}></table>;
});

const TableHeader = React.forwardRef<HTMLTableSectionElement>(({}, ref) => {
  return <thead ref={ref}></thead>;
});

const TableBody = React.forwardRef<HTMLTableSectionElement>(({}, ref) => {
  return <tbody ref={ref}></tbody>;
});

const TableFooter = React.forwardRef<HTMLTableSectionElement>(({}, ref) => {
  return <tfoot ref={ref}></tfoot>;
});

const TableRow = React.forwardRef<HTMLTableRowElement>(({}, ref) => {
  return <tr ref={ref}></tr>;
});

const TableHead = React.forwardRef<HTMLTableCellElement>(({}, ref) => {
  return <th ref={ref}></th>;
});

const TableCell = React.forwardRef<HTMLTableCellElement>(({}, ref) => {
  return <td ref={ref}></td>;
});

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
});
