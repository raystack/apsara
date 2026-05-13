import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';
import styles from './table.module.css';

const table = cva(styles['table']);
function TableRoot({
  className,
  ...props
}: ComponentProps<'table'> & VariantProps<typeof table>) {
  return <table {...props} className={table({ className })} />;
}
TableRoot.displayName = 'Table';

const header = cva(styles['header']);
function TableHeader({
  className,
  ...props
}: ComponentProps<'thead'> & VariantProps<typeof header>) {
  return <thead {...props} className={header({ className })} />;
}
TableHeader.displayName = 'Table.Header';

function TableBody({ ...props }: ComponentProps<'tbody'>) {
  return <tbody {...props} />;
}
TableBody.displayName = 'Table.Body';

function TableRow({ ...props }: ComponentProps<'tr'>) {
  return <tr {...props} />;
}
TableRow.displayName = 'Table.Row';

const head = cva(styles['head']);
function TableHead({
  className,
  scope = 'col',
  ...props
}: ComponentProps<'th'> & VariantProps<typeof head>) {
  return <th scope={scope} {...props} className={head({ className })} />;
}
TableHead.displayName = 'Table.Head';

function TableCaption({ ...props }: ComponentProps<'caption'>) {
  return <caption {...props} />;
}
TableCaption.displayName = 'Table.Caption';

const cell = cva(styles['cell']);
function TableCell({
  className,
  ...props
}: ComponentProps<'td'> & VariantProps<typeof cell>) {
  return <td {...props} className={cell({ className })} />;
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
  classNames?: Partial<Record<SectionHeaderClassNames, string>>;
}) {
  return (
    <tr
      ref={ref}
      className={sectionHeader({ className: classNames?.row })}
      {...rest}
    >
      <th scope='colgroup' colSpan={colSpan} className={classNames?.cell}>
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
  Caption: TableCaption,
  SectionHeader: SectionHeader
});
