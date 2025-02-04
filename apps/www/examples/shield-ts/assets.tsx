import React, { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import { HomeIcon } from "@radix-ui/react-icons";
import {
  DataTable,
  Title,
  useTable
} from "@raystack/apsara";

import { toast, ToastContainer, Avatar, AvatarGroup, Button, Spinner, DropdownMenu, Breadcrumb, Chip, Flex, Text, Checkbox, InputField, Badge, Radio, Search, Separator } from "@raystack/apsara/v1";

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

  const [recipients, setRecipients] = useState([
    { label: "A", onRemove: () => handleRemoveRecipient("A") },
    { label: "B", onRemove: () => handleRemoveRecipient("B") },
    { label: "C", onRemove: () => handleRemoveRecipient("C") },
    { label: "D", onRemove: () => handleRemoveRecipient("D") },
    { label: "E", onRemove: () => handleRemoveRecipient("E") }
  ]);

  const handleRemoveRecipient = (label: string) => {
    setRecipients(prev => prev.filter(recipient => recipient.label !== label));
  };

  const handleAddRecipient = (value: string) => {
    if (value && !recipients.find(r => r.label === value)) {
      setRecipients(prev => [...prev, { 
        label: value, 
        onRemove: () => handleRemoveRecipient(value) 
      }]);
    }
  };

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
    <div style={{ padding: "var(--rs-space-5)", width: "100%" }}>
      <Flex direction="column" gap="large" style={{ width: "100%" }}>
        <Flex direction="column" gap="medium" style={{ width: "100%" }}>
          <Flex direction="column" gap="medium">
            <Title>Solid Buttons</Title>
            <Flex gap="small" wrap="wrap">
              <Button variant="solid" color="accent">solid-accent</Button>
              <Button variant="solid" color="danger">solid-danger</Button>
              <Button variant="solid" color="neutral">solid-neutral</Button>
              <Button variant="solid" color="success">solid-success</Button>
            </Flex>

            <Title>Outline Buttons</Title>
            <Flex gap="small" wrap="wrap">
              <Button variant="outline" color="accent">outline-accent</Button>
              <Button variant="outline" color="danger">outline-danger</Button>
              <Button variant="outline" color="neutral">outline-neutral</Button>
              <Button variant="outline" color="success">outline-success</Button>
            </Flex>

            <Title>Ghost & Text Buttons</Title>
            <Flex gap="small" wrap="wrap">
              <Button variant="ghost">ghost</Button>
              <Button variant="text">text</Button>
            </Flex>

            <Title>Loading State</Title>
            <Flex gap="small" wrap="wrap">
              <Button variant="solid" color="accent" loading>Loading</Button>
              <Button variant="outline" color="accent" loading>Loading</Button>
              <Button variant="ghost" loading>Loading</Button>
              <Button variant="text" loading>Loading</Button>
            </Flex>

            <Title>Disabled State</Title>
            <Flex gap="small" wrap="wrap">
              <Button variant="solid" color="accent" disabled>Disabled</Button>
              <Button variant="outline" color="accent" disabled>Disabled</Button>
              <Button variant="ghost" disabled>Disabled</Button>
              <Button variant="text" disabled>Disabled</Button>
            </Flex>
          </Flex>

          <InputField
            label="Label"
            placeholder="Type and press Enter..."
            chips={recipients}
            maxChipsVisible={2}
            size="small"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddRecipient((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />

          <div style={{ width: "100%" }}>
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
          </div>
        </Flex>
      </Flex>
    </div>
  );
};

const AssetsHeader = () => {
  const { filteredColumns } = useTable();
  const [checked, setChecked] = useState<boolean | 'indeterminate'>('indeterminate');
  const [searchValue, setSearchValue] = useState("");
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
      <Flex gap="extra-large" align="center" style={{ width: "100%" }}>
        {/* <Search 
          placeholder="Search assets..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          showClearButton
          onClear={() => setSearchValue("")}
        /> */}
        <Separator color="tertiary" />
        <Flex gap="small" align="center">
        </Flex>
      </Flex>
      <Flex gap="small">
        <AssetsFooter />
        {isFiltered ? <DataTable.ClearFilter /> : <DataTable.FilterOptions />}
        <DataTable.ViewOptions />
        
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
