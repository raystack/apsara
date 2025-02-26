import { Container, DataTable, DataTableColumnDef } from "@raystack/apsara/v1";
import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";

export const columns: DataTableColumnDef<any, unknown>[] = [
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
    columnType: "text",
  },
  {
    accessorKey: "email",
    header: "Email",
    enableHiding: true,
    cell: ({ row, getValue }) => <div className="lowercase">Hello</div>,
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

export const getData = () =>
  Array.from({ length: 500 }, () => ({
    status: faker.helpers.arrayElement(["active", "inactive", "pending"]),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 67 }), // Random age between 18-67
    created_at: faker.date.past({ years: 7 }).toISOString().split("T")[0], // Random date in past 7 years
  }));

export default function DataTableExample() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(getData());
  }, []);

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
          mode="client"
          defaultSort={{ key: "name", order: "asc" }}
        >
          <DataTable.Toolbar />
          <DataTable.Content />
        </DataTable>
      </Container>
    </>
  );
}
