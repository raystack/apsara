import React, { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import { PlusIcon, BlendingModeIcon } from "@radix-ui/react-icons";
import {
  ApsaraColumnDef,
  Avatar,
  AvatarGroup,
  Button,
  Checkbox,
  DataTable,
  Flex,
  Spinner,
  Text,
  useTable,
} from "@raystack/apsara";

import { getData, Payment } from "./data";
const TOTAL_PAGES = 100;

export const columns: ApsaraColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onClick={(event) => event.stopPropagation()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
    meta: {
      data: [
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Success",
          value: "success",
        },
      ],
      defaultValue: "success",
    },
    filterVariant: "select",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row, getValue }) => <div className="lowercase">{getValue()}</div>,
    filterVariant: "text",
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    accessorFn: (originalRow) => originalRow.amount,
    cell: ({ getValue }) => {
      const amount = parseFloat(getValue());
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
    filterVariant: "number",
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ row, getValue }) => (
      <div className="lowercase">
        {dayjs(getValue()).format("DD MMM YY HH:mm")}
      </div>
    ),
    filterVariant: "date",
  },
];

export const Assets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [data, setData] = useState<Payment[]>([]);

  const loadMoreData = useCallback(() => {
    if (!isLoading && hasMoreData) {
      setIsLoading(true);
      // API simulation call to fetch more data
      setTimeout(() => {
        const moreData = getData();
        setData((prevData) => [...prevData, ...moreData]);
        setPage((prevPage) => prevPage + 1);
        setIsLoading(false);
        if (page >= TOTAL_PAGES) {
          setHasMoreData(false);
        }
      }, 1000);
    }
  }, [isLoading, hasMoreData, page]);

  useEffect(() => {
    loadMoreData()
  }, [])

  return (
    <DataTable
      columns={columns}
      data={data}
      initialState={{ sorting: [{ id: "amount", desc: true }] }}
      isLoading={isLoading}
      onLoadMore={loadMoreData}
    >
      <DataTable.Toolbar>
        <AssetsHeader />
        <DataTable.FilterChips />
      </DataTable.Toolbar>
      <DataTable.Footer>
        <></>
      </DataTable.Footer>
    </DataTable>
  );
};

const AssetsHeader = () => {
  const { filteredColumns } = useTable();
  const isFiltered = filteredColumns.length > 0;
  return (
    <Flex
      align="center"
      justify="between"
      style={{ width: "100%", padding: "4px" }}
    >
      <Flex gap="extra-large" align="center">
        <Text style={{ fontWeight: 500 }}>Assets</Text>
        <Button variant="primary" leadingIcon={<PlusIcon width={12} height="12" />} trailingIcon={<BlendingModeIcon width={12} height="12" />}>Label</Button>
        <AvatarGroup max={3}>
          <Avatar
            radius="full"
            variant="solid"
            size={6}
            color="iris"
            fallback={<>GS</>}
          />
          <Avatar
            radius="full"
            variant="solid"
            size={6}
            color="mint"
            fallback={<>RK</>}
          />
          <Avatar
            radius="full"
            variant="solid"
            size={6}
            color="orange"
            fallback={<>RK</>}
          />
        </AvatarGroup>
      </Flex>
      <Flex gap="small">
        <AssetsFooter />
        {isFiltered ? <DataTable.ClearFilter /> : <DataTable.FilterOptions />}
        <DataTable.ViewOptions />
        <DataTable.GloabalSearch placeholder="Search assets..." />
      </Flex>
    </Flex>
  );
};

const AssetsFooter = () => {
  const { table } = useTable();

  return (
    <Flex align="center" justify="between" style={{ width: "100%" }}>
      <Text>
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {getData().length * (TOTAL_PAGES + 1)} row(s) selected.
      </Text>
    </Flex>
  );
};
