"use client"
import React, { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import { HomeIcon, CheckIcon } from "@radix-ui/react-icons";
import { DataTable, Title, useTable, Dialog as DialogLegacy } from "@raystack/apsara";

import {
  toast,
  ToastContainer,
  Button,
  Flex,
  Text,
  Checkbox,
  InputField,
  Search,
  Headline,
  Dialog,
  RangePicker,
  Sheet,
  TextArea,
  Tooltip
} from "@raystack/apsara/v1";
import dynamic from 'next/dynamic';

import { getData, Payment } from "./data";
import { ApsaraColumnDef } from "@raystack/apsara/table/datatables.types";
const TOTAL_PAGES = 100;

const ClientPopover = dynamic(
  () => import('./components/ClientPopover').then(mod => mod.ClientPopover),
  { ssr: false }
);

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
  const [searchValue, setSearchValue] = useState("");
  const [hasMoreData, setHasMoreData] = useState(true);
  const [data, setData] = useState<Payment[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [legacyDialogOpen, setLegacyDialogOpen] = useState(false);

  const activeFilters = [
    {
      label: "Category",
      value: "Workflow",
    },
    {
      label: "Status",
      value: "Active",
    },
    {
      label: "Priority",
      value: "High",
    },
  ];
  const [recipients, setRecipients] = useState([
    { label: "A", onRemove: () => handleRemoveRecipient("A") },
    { label: "B", onRemove: () => handleRemoveRecipient("B") },
    { label: "C", onRemove: () => handleRemoveRecipient("C") },
    { label: "D", onRemove: () => handleRemoveRecipient("D") },
    { label: "E", onRemove: () => handleRemoveRecipient("E") },
  ]);

  const handleRemoveRecipient = (label: string) => {
    setRecipients((prev) =>
      prev.filter((recipient) => recipient.label !== label)
    );
  };

  const handleAddRecipient = (value: string) => {
    if (value && !recipients.find((r) => r.label === value)) {
      setRecipients((prev) => [
        ...prev,
        {
          label: value,
          onRemove: () => handleRemoveRecipient(value),
        },
      ]);
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
        const successToastId = toast.success("Data loaded successfully.", {
          duration: Infinity,
          dismissible: true,
          action: (
            <Button size="small" onClick={() => toast.dismiss(successToastId)}>
              Click Me
            </Button>
          ),
        });
        break;
      case "error":
        const errorToastId = toast.info("Error loading data!", {
          duration: Infinity,
          dismissible: true,
          action: (
            <Button size="small" onClick={() => toast.dismiss(errorToastId)}>
              Retry
            </Button>
          ),
        });
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

  const handleFilterChange = (filter: any) => {
    console.log("Filter changed:", filter);
  };

  const handleOperationChange = (operation: string) => {
    console.log("Operation changed:", operation);
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <Flex direction="column" style={{ width: "100%" }}>
        <Flex direction="column" style={{ width: "100%" }}>
          <Flex direction="column" gap="large" style={{ width: "100%" }}>
            <Flex gap="large" wrap="wrap" style={{ width: "50%" }}>
              <Search 
                placeholder="Search assets..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                showClearButton
                disabled
                onClear={() => setSearchValue("")}
                size="large"
                width={300}
                infoTooltip="This is sparta"
              />

              {/* Basic TextArea */}
              <TextArea
                label="Description"
                placeholder="Enter description"
                width={300}
                infoTooltip="This is a tooltip"
              />

              {/* Required TextArea */}
              <TextArea
                label="Comments"
                placeholder="Enter comments"
                required
                width={300}
              />

              {/* With Helper Text */}
              <TextArea
                label="Feedback"
                placeholder="Enter your feedback"
                helperText="Your feedback helps us improve"
                width={300}
              />

              {/* With Error State */}
              <TextArea
                label="Notes"
                placeholder="Enter notes"
                error
                helperText="This field cannot be empty"
                width={300}
              />

              {/* Optional TextArea */}
              <TextArea
                label="Additional Information"
                placeholder="Add any additional details"
                required={false}
                width={300}
              />

              {/* Disabled TextArea */}
              <TextArea
                label="Read-only Content"
                value="This content cannot be edited"
                width={300}
              />
            </Flex>
            
            <Flex direction="column" style={{ width: "100%" }}>
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
      </Flex>
      </Flex>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Content overlayBlur={false} width="800px">
          <Dialog.Title>Sample Dialog Title</Dialog.Title>
          <Dialog.Description>
            This is an example of the new V1 Dialog component.
          </Dialog.Description>
          <Flex direction="column" gap="large" style={{ marginTop: '20px' }}>
            <InputField
              label="Sample Input"
              placeholder="Enter some text"
            />
            <Flex justify="end" gap="small">
              <Button variant="solid" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setDialogOpen(false)}>Save</Button>
            </Flex>
          </Flex>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog>

      <DialogLegacy open={legacyDialogOpen} onOpenChange={setLegacyDialogOpen}>
        <DialogLegacy.Content close overlayBlur={false}>
          <DialogLegacy.Title>Legacy Dialog Title</DialogLegacy.Title>
          <DialogLegacy.Description>
            This is an example of the legacy Dialog component.
          </DialogLegacy.Description>
          <Flex direction="column" gap="large" style={{ marginTop: '20px' }}>
            <InputField
              label="Sample Input"
              placeholder="Enter some text"
            />
            <Flex justify="end" gap="small">
              <Button variant="solid" onClick={() => setLegacyDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setLegacyDialogOpen(false)}>Save</Button>
            </Flex>
          </Flex>
        </DialogLegacy.Content>
      </DialogLegacy>

      <ToastContainer />
    </div>
  );
};

const AssetsHeader = () => {
  const { filteredColumns, table } = useTable();
  const [checked, setChecked] = useState<boolean | "indeterminate">(
    "indeterminate"
  );
  const [searchValue, setSearchValue] = useState("");
  const handleCheckedChange = (newChecked: boolean | "indeterminate") => {
    if (newChecked !== "indeterminate") {
      setChecked(newChecked);
    }
  };
  const isFiltered = filteredColumns.length > 0;
  const items = [
    { label: "Home", href: "/", icon: <HomeIcon /> },
    { label: "Category", href: "/category" },
    {
      label: "Subcategory",
      href: "/category/subcategory",
      dropdownItems: [
        { label: "Option 1", href: "/category/subcategory/option1" },
        { label: "Option 2", href: "/category/subcategory/option2" },
        { label: "Option 3", href: "/category/subcategory/option3" },
      ],
    },
    { label: "Current Page", href: "/category/subcategory/current" },
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


