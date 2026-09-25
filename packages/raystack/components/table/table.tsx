import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';
import styles from './table.module.css';

const table = cva(styles['table']);
function TableRoot({
  className,
  ...props
}: ComponentProps<'table'> & VariantProps<typeof table>) {
  return (
    <table data-slot='table' {...props} className={table({ className })} />
  );
}
TableRoot.displayName = 'Table';

const header = cva(styles['header']);
function TableHeader({
  className,
  ...props
}: ComponentProps<'thead'> & VariantProps<typeof header>) {
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
function TableRow({
  className,
  interactive,
  ...props
}: ComponentProps<'tr'> & VariantProps<typeof row>) {
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
function TableHead({
  className,
  scope = 'col',
  ...props
}: ComponentProps<'th'> & VariantProps<typeof head>) {
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
function TableCell({
  className,
  ...props
}: ComponentProps<'td'> & VariantProps<typeof cell>) {
  return (
    <td data-slot='table-cell' {...props} className={cell({ className })} />
  );
}
TableCell.displayName = 'Table.Cell';

const sectionHeader = cva(styles['sectionHeader']);
type SectionHeaderClassNames = 'row' | 'cell';
function SectionHeader({
  classNames,
  colSpan,
  children,
  ref,
  ...rest
}: ComponentProps<'tr'> & {
  colSpan: number;
  /**
   * @deprecated Use `[data-slot="table-section-header"]` (row) and
   * `[data-slot="table-section-header-cell"]` (cell) instead.
   */
  classNames?: Partial<Record<SectionHeaderClassNames, string>>;
}) {
  return (
    <tr
      ref={ref}
      className={sectionHeader({ className: classNames?.row })}
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
