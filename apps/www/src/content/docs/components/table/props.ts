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
}

export interface TableHeadProps {}

export interface TableCellProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface TableSectionHeaderProps {
  /** Map of class names for internal components. */
  classNames?: {
    /** CSS class for the row. */
    row?: string;
    /** CSS class for the cell. */
    cell?: string;
  };

  /** Number of cells the row should span across. Ensures the section header spans all table columns. */
  colSpan?: number;
}
