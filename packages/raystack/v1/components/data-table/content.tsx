import { Table } from "../table";
import type { Row, HeaderGroup } from "@tanstack/react-table";
import { EmptyState } from "../empty-state";
import { TableIcon } from "@radix-ui/react-icons";
import { flexRender } from "@tanstack/react-table";
import { useDataTable } from "./hooks/useDataTable";
import { DataTableContentProps } from "./data-table.types";

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
              {/* Handles all possible header column def scenarios for `header` */}
              {flexRender(header.column.columnDef.header, header.getContext())}
            </Table.Head>
          ))}
        </Table.Row>
      ))}
    </Table.Header>
  );
}

function Rows<TData>({ rows = [] }: { rows: Row<TData>[] }) {
  return (
    <>
      {rows?.map((row) => {
        const isSelected = row.getIsSelected();
        const cells = row.getVisibleCells() || [];
        return (
          <Table.Row key={row.id} data-state={isSelected && "selected"}>
            {cells.map((cell) => {
              return (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  const { table, columns } = useDataTable();
  const headerGroups = table?.getHeaderGroups();
  const { rows = [] } = table?.getRowModel();

  return (
    <Table>
      <Headers headerGroups={headerGroups} />
      <Table.Body>
        {rows?.length ? (
          <Rows rows={rows} />
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
