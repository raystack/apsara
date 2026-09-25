export interface TableProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface TableHeaderProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface TableBodyProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface TableRowProps {
  /** Additional CSS class names. */
  className?: string;
  /**
   * Enables clickable-row styling: a pointer cursor plus hover and active
   * background states. Use for rows that respond to clicks.
   * @default false
   */
  interactive?: boolean;
}

export interface TableHeadProps {
  /**
   * Associates the header cell with rows or columns it labels.
   * @default "col"
   */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
}

export interface TableCellProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface TableSectionHeaderProps {
  /** Number of columns the row spans. Set it to the table's total column count so the section header covers the full width. (Required) */
  colSpan: number;
}
