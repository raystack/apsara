import {
  CaretUpIcon,
  CaretDownIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  InitialTableState,
  TableState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CSSProperties,
  Children,
  ComponentProps,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { Flex } from "~/flex";
import { Text } from "~/text";
import { DataTableClearFilter } from "./DataTableClearFilter";
import { DataTableFilterChips } from "./DataTableFilterChips";
import { DataTableFilterOptions } from "./DataTableFilterOptions";
import { DataTableFooter } from "./DataTableFooter";
import { DataTableGloabalSearch } from "./DataTableGloabalSearch";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { TableContext } from "./TableContext";
import { TableDetailContainer } from "./TableDetailContainer";
import styles from "./datatable.module.css";
import { useTableColumn } from "./hooks/useTableColumn";
import { Table } from "./table";
import {
  ApsaraColumnDef,
  tableFilterMap,
  updateColumnFilter,
} from "./datatables.types";
import Skeleton from "react-loading-skeleton";

type DataTableProps<TData, TValue> = {
  columns: ApsaraColumnDef<TData>[];
  data: TData[];
  multiRowSelectionEnabled?: boolean;
  children?: ReactNode;
  ShouldShowHeader?: boolean;
  emptyState?: ReactNode;
  parentStyle?: CSSProperties;
  isLoading?: boolean;
  initialState?: Partial<InitialTableState>;
  loaderRow?: number;
  onRowClick?: (d: TData) => void;
  onStateChange?: (d: Partial<TableState>) => void;
  onLoadMore?: () => void;
} & ComponentProps<typeof Table>;

function DataTableRoot<TData, TValue>({
  columns,
  data,
  emptyState,
  children,
  parentStyle,
  isLoading = false,
  ShouldShowHeader = true,
  initialState,
  loaderRow = 2,
  onRowClick,
  onStateChange = () => {},
  onLoadMore,
  ...props
}: DataTableProps<TData, TValue>) {
  const [tableCustomFilter, setTableCustomFilter] = useState<tableFilterMap>(
    {}
  );
  const convertedChildren = Children.toArray(children) as ReactElement[];
  const header =
    convertedChildren.find((child) => child.type === DataTableToolbar) || null;
  const footer =
    convertedChildren.find((child) => child.type === DataTableFooter) || null;
  const detail =
    convertedChildren.find((child) => child.type === TableDetailContainer) ||
    null;

  const [tableState, setTableState] = useState<Partial<TableState>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  const getLoader = (loaderRow: number, columns: ApsaraColumnDef<TData>[]) => (
    [...new Array(loaderRow)].map((_, rowIndex) => (
      <Table.Row key={`row_${rowIndex}`}>
        {columns.map((_, colIndex) => (
          <Table.Cell key={`col_${colIndex}`}>
            <Skeleton
              containerClassName={styles.flex1}
              highlightColor="var(--background-base)"
              baseColor="var(--background-base-hover)"
            />
          </Table.Cell>
        ))}
      </Table.Row>
    ))
  )

  const { filteredColumns, addFilterColumn, removeFilterColumn, resetColumns } =
    useTableColumn();

  const columnWithCustomFilter = useMemo(
    () =>
      columns.map((col) => {
        const colId = col.id || (col?.accessorKey as string);
        const filterFn =
          colId && tableCustomFilter.hasOwnProperty(colId)
            ? tableCustomFilter[colId]
            : undefined;

        const { cell } = col;

        return {
          ...col,
          cell,
          filterFn,
        };
      }),
    [isLoading, columns, tableCustomFilter]
  );

  useEffect(() => {
    if (onStateChange) {
      onStateChange(tableState);
    }
  }, [tableState]);

  const updateColumnCustomFilter: updateColumnFilter = (id, filterFn) => {
    setTableCustomFilter((old) => ({ ...old, [id]: filterFn }));
  };

  const table = useReactTable({
    data,
    columns: columnWithCustomFilter as unknown as ColumnDef<TData, TValue>[],
    globalFilterFn: "auto",
    enableRowSelection: true,
    manualPagination: true,
    pageCount: -1,
    onStateChange: (updater) => setTableState(updater as Partial<TableState>),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState,
    state: tableState,
  });

  const lastRowRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && onLoadMore) {
          onLoadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [data, isLoading, onLoadMore]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const tableStyle = {
    ...(table.getRowModel().rows?.length
      ? { width: "100%" }
      : { width: "100%", height: "100%" }),
    ...{ "border-collapse": "collapse" },
  };

  return (
    <Flex direction="column" justify="between" className={styles.wrapper}>
      <TableContext.Provider
        value={{
          table,
          globalFilter: tableState.globalFilter,
          filteredColumns,
          addFilterColumn,
          removeFilterColumn,
          resetColumns,
          onGlobalFilterChange: (value) =>
            setTableState((prev) => ({ ...prev, globalFilter: value })),
          onChange: () => ({}),
          tableCustomFilter,
          updateColumnCustomFilter,
          isLoading,
        }}
      >
        <Flex direction="column" className={styles.datatable}>
          {header}
          <Flex
            className={styles.tableContainer}
            style={parentStyle}
          >
            <Table {...props} style={tableStyle}>
              <Table.Header className={styles.header}>
                {ShouldShowHeader
                  ? table.getHeaderGroups().map((headerGroup) => (
                      <Table.Row key={headerGroup.id}>
                        {headerGroup.headers.map((header, index) => {
                          return (
                            <Table.Head
                              key={`${header.id}_${index}`}
                              style={{
                                cursor: "pointer",
                                ...(header.column.columnDef?.meta?.style ?? {}),
                              }}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <Text className={styles.head}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                {header.column.getCanSort()
                                  ? {
                                      asc: <CaretUpIcon />,
                                      desc: <CaretDownIcon />,
                                    }[
                                      header.column.getIsSorted() as string
                                    ] ?? <CaretSortIcon />
                                  : null}
                              </Text>
                            </Table.Head>
                          );
                        })}
                      </Table.Row>
                    ))
                  : null}
              </Table.Header>
              <Table.Body>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, rowIndex) => (
                    <Table.Row
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onRowClick?.(row.original)}
                      className={
                        isLoading
                          ? ""
                          : `${styles.tRow} ${
                              onRowClick ? styles.tRowClick : ""
                            }`
                      }
                      ref={
                        rowIndex === table.getRowModel().rows.length - 1
                          ? lastRowRef
                          : null
                      }
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <Table.Cell
                          key={`${cell.id}_${index}`}
                          style={{
                            ...(cell.column.columnDef?.meta?.style ?? {}),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={columns.length}>
                      {emptyState || "No results."}
                    </Table.Cell>
                  </Table.Row>
                )}
                {isLoading && getLoader(loaderRow, columns)}
              </Table.Body>
            </Table>
            {detail}
          </Flex>
        </Flex>
        {footer}
      </TableContext.Provider>
    </Flex>
  );
}

export const DataTable = Object.assign(DataTableRoot, {
  Toolbar: DataTableToolbar,
  GloabalSearch: DataTableGloabalSearch,
  FilterOptions: DataTableFilterOptions,
  ViewOptions: DataTableViewOptions,
  ClearFilter: DataTableClearFilter,
  FilterChips: DataTableFilterChips,
  Footer: DataTableFooter,
  DetailContainer: TableDetailContainer,
});
