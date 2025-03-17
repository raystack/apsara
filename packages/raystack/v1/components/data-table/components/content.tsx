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
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Badge } from "../../badge";
import { Flex } from "../../flex";
import styles from "../data-table.module.css";
import clsx from "clsx";

function Headers<TData>({
  headerGroups = [],
  className = "",
}: {
  headerGroups: HeaderGroup<TData>[];
  className?: string;
}) {
  return (
    <Table.Header className={className}>
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
  onRowClick?: (row: TData) => void;
  classNames?: {
    row?: string;
  };
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
            <Skeleton
              highlightColor="var(--rs-color-background-base-primary)"
              baseColor="var(--rs-color-background-base-primary-hover)"
            />
          </Table.Cell>
        ))}
      </Table.Row>
    );
  });
}

function GroupHeader<TData>({
  colSpan,
  data,
}: {
  colSpan: number;
  data: GroupedData<TData>;
}) {
  return (
    <Table.SectionHeader colSpan={colSpan}>
      <Flex gap={3} align="center">
        {data?.label}
        {data.showGroupCount ? (
          <Badge variant="neutral">{data?.count}</Badge>
        ) : null}
      </Flex>
    </Table.SectionHeader>
  );
}

const Rows = forwardRef<HTMLTableRowElement, RowsProps<unknown>>(
  (props, lastRowRef) => {
    const { rows = [], onRowClick, classNames } = props;
    return (
      <>
        {rows?.map((row, index) => {
          const isSelected = row.getIsSelected();
          const cells = row.getVisibleCells() || [];
          const isSectionHeadingRow = row.depth === 0 && row.getIsExpanded();
          const isLastRow = index === rows.length - 1;
          const rowKey = row.id + "-" + index;
          return isSectionHeadingRow ? (
            <GroupHeader
              key={rowKey}
              colSpan={cells.length}
              data={row.original as GroupedData<unknown>}
            />
          ) : (
            <Table.Row
              key={rowKey}
              className={clsx(
                styles["row"],
                onRowClick ? styles["clickable"] : "",
                classNames?.row
              )}
              data-state={isSelected && "selected"}
              ref={isLastRow ? lastRowRef : undefined}
              onClick={() => onRowClick?.(row.original)}
            >
              {cells.map((cell) => {
                const columnDef = cell.column.columnDef as DataTableColumnDef<
                  unknown,
                  unknown
                >;
                return (
                  <Table.Cell
                    key={cell.id}
                    className={clsx(styles["cell"], columnDef.classNames?.cell)}
                    style={columnDef.styles?.cell}
                  >
                    {flexRender(columnDef.cell, cell.getContext())}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          );
        })}
      </>
    );
  }
);

const DefaultEmptyComponent = () => (
  <EmptyState icon={<TableIcon />} heading="No Data" />
);

export function Content({
  emptyState,
  classNames = {},
}: DataTableContentProps) {
  const {
    onRowClick,
    table,
    mode,
    isLoading,
    loadMoreData,
    loadingRowCount = 3,
  } = useDataTable();
  const headerGroups = table?.getHeaderGroups();
  const { rows = [] } = table?.getRowModel();

  const lastRowRef = useRef<HTMLTableRowElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading) {
        loadMoreData();
      }
    },
    [loadMoreData, isLoading]
  );

  useEffect(() => {
    if (mode !== "server") return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    const lastRow = lastRowRef.current;
    if (lastRow) {
      observerRef.current.observe(lastRow);
    }

    return () => {
      if (observerRef.current && lastRow) {
        observerRef.current.unobserve(lastRow);
        observerRef.current.disconnect();
      }
    };
  }, [mode, rows.length, handleObserver]);

  const visibleColumnsLength = table.getVisibleLeafColumns().length;

  return (
    <div className={classNames.root}>
      <Table className={classNames.table}>
        <Headers headerGroups={headerGroups} className={classNames.header} />
        <Table.Body className={classNames.body}>
          {rows?.length || isLoading ? (
            <>
              <Rows
                rows={rows}
                ref={lastRowRef}
                onRowClick={onRowClick}
                classNames={{
                  row: classNames.row,
                }}
              />
              {isLoading ? (
                <LoaderRows
                  rowCount={loadingRowCount}
                  columnCount={visibleColumnsLength}
                />
              ) : null}
            </>
          ) : (
            <Table.Row>
              <Table.Cell colSpan={visibleColumnsLength}>
                {emptyState || <DefaultEmptyComponent />}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
}
