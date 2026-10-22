import { cva, cx, type VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';
import styles from './table.module.css';

const table = cva(styles['table']);
export type TableProps = ComponentProps<'table'> & VariantProps<typeof table>;
function TableRoot({ className, ...props }: TableProps) {
  return (
    <table data-slot='table' {...props} className={table({ className })} />
  );
}
TableRoot.displayName = 'Table';

const header = cva(styles['header']);
export type TableHeaderProps = ComponentProps<'thead'> &
  VariantProps<typeof header>;
function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead
      data-slot='table-header'
      {...props}
      className={header({ className })}
    />
  );
}
TableHeader.displayName = 'Table.Header';

function TableBody({ ...props }: ComponentProps<'tbody'>) {
  return <tbody data-slot='table-body' {...props} />;
}
TableBody.displayName = 'Table.Body';

const row = cva(styles['row'], {
  variants: {
    interactive: {
      true: styles['row-interactive']
    }
  }
});
export type TableRowProps = ComponentProps<'tr'> & VariantProps<typeof row>;
function TableRow({ className, interactive, ...props }: TableRowProps) {
  return (
    <tr
      data-slot='table-row'
      {...props}
      className={row({ interactive, className })}
    />
  );
}
TableRow.displayName = 'Table.Row';

const head = cva(styles['head']);
export type TableHeadProps = ComponentProps<'th'> & VariantProps<typeof head>;
function TableHead({ className, scope = 'col', ...props }: TableHeadProps) {
  return (
    <th
      scope={scope}
      data-slot='table-head'
      {...props}
      className={head({ className })}
    />
  );
}
TableHead.displayName = 'Table.Head';

const cell = cva(styles['cell']);
export type TableCellProps = ComponentProps<'td'> & VariantProps<typeof cell>;
function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td data-slot='table-cell' {...props} className={cell({ className })} />
  );
}
TableCell.displayName = 'Table.Cell';

const sectionHeader = cva(styles['sectionHeader']);
type SectionHeaderClassNames = 'row' | 'cell';
export interface TableSectionHeaderProps extends ComponentProps<'tr'> {
  colSpan: number;
  /**
   * @deprecated Use `[data-slot="table-section-header"]` (row) and
   * `[data-slot="table-section-header-cell"]` (cell) instead.
   */
  classNames?: Partial<Record<SectionHeaderClassNames, string>>;
}
function SectionHeader({
  className,
  classNames,
  colSpan,
  children,
  ref,
  ...rest
}: TableSectionHeaderProps) {
  return (
    <tr
      ref={ref}
      className={sectionHeader({ className: cx(classNames?.row, className) })}
      data-slot='table-section-header'
      {...rest}
    >
      <th
        scope='colgroup'
        colSpan={colSpan}
        className={classNames?.cell}
        data-slot='table-section-header-cell'
      >
        {children}
      </th>
    </tr>
  );
}
SectionHeader.displayName = 'Table.SectionHeader';

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  SectionHeader: SectionHeader
});
