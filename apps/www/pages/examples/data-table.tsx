import { Container, DataTable, DataTableColumnDef } from "@raystack/apsara/v1";

export const columns: DataTableColumnDef<any, unknown>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row, getValue }) => <div className="lowercase">Hello</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => <div>{row.getValue("age")}</div>,
  },
];

const data = [
  { status: "active", email: "test@raystack.org", name: "John Doe", age: 30 },
  {
    status: "inactive",
    email: "test2@raystack.org",
    name: "Jane Doe",
    age: 25,
  },
  { status: "active", email: "test3@examepl.com", name: "John Smith", age: 35 },
];

export default function DataTableExample() {
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
        <DataTable data={data} columns={columns}>
          <DataTable.Content />
        </DataTable>
      </Container>
    </>
  );
}
