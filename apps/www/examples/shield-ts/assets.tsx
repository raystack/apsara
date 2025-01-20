import React, { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import { HomeIcon } from "@radix-ui/react-icons";
import {
  DataTable,
  Title,
  useTable
} from "@raystack/apsara";


import { toast, ToastContainer, Button, Flex, Text, Checkbox } from "@raystack/apsara/v1";

import { getData, Payment } from "./data";
import { ApsaraColumnDef } from "@raystack/apsara/table/datatables.types";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  });

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

  const showToast = (variant: string) => {
    switch (variant) {
      case "success":
        const successToastId = toast.success('Data loaded successfully.',
        { 
          duration: Infinity,
          dismissible: true,
          action: <Button size="small" onClick={() => toast.dismiss(successToastId)}>
            Click Me
          </Button>
        }
        );
        break;  
      case "error":
        const errorToastId = toast.info('Error loading data!',
        { 
          duration: Infinity,
          dismissible: true,
          action: <Button size="small" onClick={() => toast.dismiss(errorToastId)}>Retry</Button>
        }
        );
        break;
      default:
        const defaultToastId = toast(
          <div>
            Default message
            <Button size="small" onClick={() => toast.dismiss(defaultToastId)}>
              Action
            </Button>
          </div>,
          { duration: Infinity, dismissible: true }
        );
    }
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <>
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
          {/* <Flex gap="small"> */}
            {/* <Button size="small" variant="primary" onClick={() => showToast("success")}>Show Success Toast!</Button>
            <Button size="small" variant="danger" onClick={() => showToast("error")}>Show Error Toast with custom icon</Button> */}
          {/* </Flex> */}
        </DataTable.Toolbar>
        <DataTable.Footer>
          <></>
        </DataTable.Footer>
      </DataTable>
      <ToastContainer />
    </>
  );
};

const AssetsHeader = () => {
  const { filteredColumns } = useTable();
  const [checked, setChecked] = useState<boolean | 'indeterminate'>('indeterminate');
  const handleCheckedChange = (newChecked: boolean | 'indeterminate') => {
    if (newChecked !== 'indeterminate') {
      setChecked(newChecked);
    }
  };
  const isFiltered = filteredColumns.length > 0;
  const items = [
    { label: 'Home', href: '/', icon: <HomeIcon /> },
    { label: 'Category', href: '/category' },
    { 
      label: 'Subcategory', 
      href: '/category/subcategory',
      dropdownItems: [
        { label: 'Option 1', href: '/category/subcategory/option1' },
        { label: 'Option 2', href: '/category/subcategory/option2' },
        { label: 'Option 3', href: '/category/subcategory/option3' },
      ]
    },
    { label: 'Current Page', href: '/category/subcategory/current' },
  ];

  return (
    <Flex
      align="center"
      justify="between"
      style={{ width: "100%", padding: "4px", paddingTop: "48px" }}
    >
      <Flex gap="extra-large" align="center">
    {/* More footer items */}
        {/* <Text style={{ fontWeight: 500 }}>Assets</Text> */}
        {/* <Spinner size={3} />
        <div>
        <Checkbox 
            checked={checked}
            onCheckedChange={(value) => {
              setChecked(value);
              console.log('New value:', value);
            }} 
          />
        </div> */}
        {/* <InputField
          label="Label"
          helperText="Helper Text"
          placeholder="Place holder"
          prefix="USD"
        /> */}
        {/* <Badge size="small" variant="gradient" icon={<HomeIcon />}>
          Custom Badge
        </Badge> */}
        
        {/* <Button variant="outline">Click here</Button>
        <Breadcrumb items={items} size="small" />
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="secondary" size="small">Actions</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start">
            <DropdownMenu.EmptyState>
              <Title>No insights yet</Title>
              <Text>You need to run a model to generate insights</Text>
              <Button>Action Button</Button>
            </DropdownMenu.EmptyState>
          </DropdownMenu.Content>
        </DropdownMenu> */}
        {/* <AvatarGroup max={3}>
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
        </AvatarGroup> */}

        
        {/* Add Chip examples */}
        <Flex gap="small" align="center">
          {/* <Chip isDismissible variant="filled" size="small" style="accent" leadingIcon={<HomeIcon />} trailingIcon={<CheckIcon />}>Default</Chip> */}
          {/* <Radio.Root defaultValue="1" aria-label="View options">
            <Flex gap="small" align="center" style={{ minWidth: '200px' }}>
              <Radio.Item value="1" id="r1" />
              <label htmlFor="r1">Option 1</label>
              <Radio.Item value="2" id="r2" />
              <label htmlFor="r2">Option 2</label>
            </Flex>
          </Radio.Root> */}
          {/* <Chip 
            variant="filled" 
            size="large" 
            style="accent"
            leadingIcon={<PlusIcon />}
          >
            Large Accent
          </Chip>

          <Chip 
            variant="filled"
            trailingIcon={<CheckIcon />}
          >
            With Icon
          </Chip>

          <Chip 
            variant="outline"
            isDismissible
            onDismiss={() => console.log('dismissed')}
          >
            Dismissible
          </Chip>

          <Chip 
            style="accent"
            leadingIcon={<CheckIcon />}
            trailingIcon={<Cross1Icon />}
          >
            Both Icons
          </Chip> */}
        </Flex>

        {/* Add IconButton examples */}
        {/* <Flex gap="small" align="center">
          <IconButton size={1}>
            <PlusIcon />
          </IconButton>
          <IconButton size={2}>
            <PlusIcon />
          </IconButton>
          <IconButton size={3}>
            <PlusIcon />
          </IconButton>
          <IconButton size={4}>
            <PlusIcon />
          </IconButton> 

        </Flex>*/}

      </Flex>
      {/* <Flex gap="small">
        <AssetsFooter />
        {isFiltered ? <DataTable.ClearFilter /> : <DataTable.FilterOptions />}
        <DataTable.ViewOptions />
        <DataTable.GloabalSearch placeholder="Search assets..." />
      </Flex> */}
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
