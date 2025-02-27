import { Container, DataTable, DataTableColumnDef } from "@raystack/apsara/v1";
import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";

export const columns: DataTableColumnDef<any, any>[] = [
  {
    accessorKey: "status",
    header: "Status",
    enableHiding: true,
    enableColumnFilter: true,
    defaultVisibility: false,
    enableSorting: true,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
    columnType: "select",
    filterOptions: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Pending", value: "pending" },
    ],
  },
  {
    accessorKey: "email",
    header: "Email",
    enableHiding: true,
    cell: ({ row, getValue }) => (
      <div className="lowercase">{row.getValue("email")}</div>
    ),
    columnType: "text",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    columnType: "text",
  },
  {
    accessorKey: "age",
    columnType: "number",
    header: "Age",
    cell: ({ row }) => <div>{row.getValue("age")}</div>,
  },
  {
    accessorKey: "created_at",
    columnType: "datetime",
    header: "Created At",
    cell: ({ row }) => <div>{row.getValue("created_at")}</div>,
  },
];

interface PaginatedData {
  status: string;
  email: string;
  name: string;
  age: number;
  created_at: string;
}

export const getData = async (): Promise<PaginatedData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const paginatedData = Array.from({ length: 10 }, () => ({
        status: faker.helpers.arrayElement(["active", "inactive", "pending"]),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 67 }), // Random age between 18-67
        created_at: faker.date.past({ years: 7 }).toISOString().split("T")[0], // Random date in past 7 years
      }));
      resolve(paginatedData);
    }, 1000); // Simulated 1-second delay
  });
};

export default function DataTableExample() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function onLoadMore() {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const newData = await getData();
      setData((prev) => [...prev, ...newData]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  console.log(data.length);

  useEffect(() => {
    onLoadMore();
  }, []);

  function onTableStateChange(tableState) {
    // console.log("Table state changed", tableState);
  }

  return (
    <>
      <Container
        size="none"
        style={{
          padding: 0,
          height: "calc(100vh - 75px)",
          fontSize: "var(--fs-200)",
        }}
      >
        <DataTable
          data={data}
          columns={columns}
          mode="server"
          isLoading={isLoading}
          defaultSort={{ key: "name", order: "asc" }}
          onTableStateChange={onTableStateChange}
          onLoadMore={onLoadMore}
        >
          <DataTable.Search />
          <DataTable.Toolbar />
          <DataTable.Content />
        </DataTable>
      </Container>
    </>
  );
}
