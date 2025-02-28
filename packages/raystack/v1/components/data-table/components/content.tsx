import { Table } from "../../table";
import type { Row, HeaderGroup } from "@tanstack/react-table";
import { EmptyState } from "../../empty-state";
import { TableIcon } from "@radix-ui/react-icons";
import { flexRender } from "@tanstack/react-table";
import { useDataTable } from "../hooks/useDataTable";
import {
  DataTableColumnDef,
  DataTableContentProps,
  GroupedData,
} from "../data-table.types";
import Skeleton from "react-loading-skeleton";
import { ForwardedRef, useEffect, useRef } from "react";

function Headers<TData>({
  headerGroups = [],
}: {
  headerGroups: HeaderGroup<TData>[];
}) {
  return (
    <Table.Header>
      {headerGroups?.map((headerGroup) => (
        <Table.Row key={headerGroup?.id}>
          {headerGroup?.headers?.map((header) => {
            const columnDef = header.column.columnDef as DataTableColumnDef<
              TData,
              unknown
            >;
            return (
              <Table.Head
                key={header.id}
                colSpan={header.colSpan}
                className={columnDef.classNames?.header}
                style={columnDef.styles?.header}
              >
                {flexRender(columnDef.header, header.getContext())}
              </Table.Head>
            );
          })}
        </Table.Row>
      ))}
    </Table.Header>
  );
}

interface RowsProps<TData> {
  rows: Row<TData>[];
  lastRowRef?: ForwardedRef<HTMLTableRowElement>;
}

function LoaderRows({
  rowCount,
  columnCount,
}: {
  rowCount: number;
  columnCount: number;
}) {
  const rows = Array.from({ length: rowCount });
  return rows.map((_, rowIndex) => {
    const columns = Array.from({ length: columnCount });
    return (
      <Table.Row key={"loading-row-" + rowIndex}>
        {columns.map((_, colIndex) => (
          <Table.Cell key={"loading-column-" + colIndex}>
            <Skeleton />
          </Table.Cell>
        ))}
      </Table.Row>
    );
  });
}

function Rows<TData>({ rows = [], lastRowRef }: RowsProps<TData>) {
  return (
    <>
      {rows?.map((row, index) => {
        const isSelected = row.getIsSelected();
        const cells = row.getVisibleCells() || [];
        const isSectionHeadingRow = row.depth === 0 && row.getIsExpanded();
        const lastRow = index === rows.length - 1;
        return isSectionHeadingRow ? (
          <Table.SectionHeader key={row.id} colSpan={cells.length}>
            {(row?.original as GroupedData<TData>)?.group_key}
          </Table.SectionHeader>
        ) : (
          <>
            <Table.Row
              key={row.id + "-" + index}
              data-state={isSelected && "selected"}
              ref={lastRow ? lastRowRef : undefined}
            >
              {cells.map((cell) => {
                const columnDef = cell.column.columnDef as DataTableColumnDef<
                  TData,
                  unknown
                >;
                return (
                  <Table.Cell
                    key={cell.id}
                    className={columnDef.classNames?.cell}
                    style={columnDef.styles?.cell}
                  >
                    {flexRender(columnDef.cell, cell.getContext())}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          </>
        );
      })}
    </>
  );
}

const DefaultEmptyComponent = () => (
  <EmptyState icon={<TableIcon />} heading="No Data" />
);

export function Content({ emptyState }: DataTableContentProps) {
  const {
    table,
    columns,
    mode,
    isLoading,
    loadMoreData,
    loadingRowCount = 3,
  } = useDataTable();
  const headerGroups = table?.getHeaderGroups();
  const { rows = [] } = table?.getRowModel();

  const lastRowRef = useRef<HTMLTableRowElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (mode !== "server") return;

    if (!lastRowRef.current) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreData();
          }
        },
        { threshold: 1 }
      );
    }

    const lastRow = lastRowRef.current;
    observerRef.current.observe(lastRow);

    return () => {
      if (observerRef.current) {
        observerRef.current.unobserve(lastRow);
      }
    };
  }, [mode, rows.length]);

  return (
    <Table>
      <Headers headerGroups={headerGroups} />
      <Table.Body>
        {rows?.length || isLoading ? (
          <>
            <Rows rows={rows} lastRowRef={lastRowRef} />
            {isLoading ? (
              <LoaderRows
                rowCount={loadingRowCount}
                columnCount={columns.length}
              />
            ) : null}
          </>
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
