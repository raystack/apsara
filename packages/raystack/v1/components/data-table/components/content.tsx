import { Table } from "../../table";
import type { Row, HeaderGroup } from "@tanstack/react-table";
import { EmptyState } from "../../empty-state";
import { TableIcon } from "@radix-ui/react-icons";
import { flexRender } from "@tanstack/react-table";
import { useDataTable } from "../hooks/useDataTable";
import { DataTableContentProps, GroupedData } from "../data-table.types";
import Skeleton from "react-loading-skeleton";

function Headers<TData>({
  headerGroups = [],
}: {
  headerGroups: HeaderGroup<TData>[];
}) {
  return (
    <Table.Header>
      {headerGroups?.map((headerGroup) => (
        <Table.Row key={headerGroup?.id}>
          {headerGroup?.headers?.map((header) => (
            <Table.Head key={header.id} colSpan={header.colSpan}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </Table.Head>
          ))}
        </Table.Row>
      ))}
    </Table.Header>
  );
}

function Rows<TData>({
  rows = [],
  isLoading,
}: {
  rows: Row<TData>[];
  isLoading?: boolean;
}) {
  return (
    <>
      {rows?.map((row) => {
        const isSelected = row.getIsSelected();
        const cells = row.getVisibleCells() || [];
        const isSectionHeadingRow = row.depth === 0 && row.getIsExpanded();

        return isSectionHeadingRow ? (
          <Table.SectionHeader key={row.id} colSpan={cells.length}>
            {(row?.original as GroupedData<TData>)?.group_key}
          </Table.SectionHeader>
        ) : (
          <Table.Row key={row.id} data-state={isSelected && "selected"}>
            {cells.map((cell) => {
              return (
                <Table.Cell key={cell.id}>
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </Table.Cell>
              );
            })}
          </Table.Row>
        );
      })}
    </>
  );
}

const DefaultEmptyComponent = () => (
  <EmptyState icon={<TableIcon />} heading="No Data" />
);

export function Content({ emptyState }: DataTableContentProps) {
  const { table, columns, isLoading } = useDataTable();
  const headerGroups = table?.getHeaderGroups();
  const { rows = [] } = table?.getRowModel();

  return (
    <Table>
      <Headers headerGroups={headerGroups} />
      <Table.Body>
        {rows?.length ? (
          <Rows rows={rows} isLoading={isLoading} />
        ) : (
          <Table.Row>
            <Table.Cell colSpan={columns.length}>
              {emptyState || <DefaultEmptyComponent />}
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}
