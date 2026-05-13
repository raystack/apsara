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

export interface TableHeadProps {
  /**
   * Associates the header cell with rows or columns it labels.
   * @default "col"
   */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
}

export interface TableCaptionProps {
  /** Caption content describing the purpose of the table. */
  children?: React.ReactNode;

  /** Additional CSS class names. */
  className?: string;
}

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
