import {
  Container,
  DataTable,
  DataTableColumnDef,
  DataTableQuery,
} from "@raystack/apsara/v1";
import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";

type PlanStatus = "active" | "cancelled" | "trialing";
type PlanName = "standard" | "professional" | "enterprise";

interface OrgBilling {
  org_name: string;
  billing_email: string;
  country: string;
  plan_name: PlanName;
  plan_start_date: string;
  plan_end_date: string;
  plan_status: PlanStatus;
  created_at: string;
  is_kyc_verified: boolean;
}

const PlanStatusMap: Record<PlanStatus, string> = {
  active: "Active",
  cancelled: "Cancelled",
  trialing: "Trialing",
};

const PlanNameMap: Record<PlanName, string> = {
  standard: "Standard",
  professional: "Professional",
  enterprise: "Enterprise",
};

export const columns: DataTableColumnDef<OrgBilling, any>[] = [
  {
    accessorKey: "org_name",
    header: "Organization Name",
    enableColumnFilter: true,
    defaultVisibility: false,
    enableSorting: true,
    cell: ({ getValue }) => <div>{getValue()}</div>,
    columnType: "text",
  },
  {
    accessorKey: "billing_email",
    header: "Email",
    enableHiding: true,
    cell: ({ getValue }) => <div>{getValue()}</div>,
    columnType: "text",
  },
  {
    accessorKey: "plan_name",
    header: "Plan Name",
    cell: ({ getValue }) => <div>{PlanNameMap[getValue()]}</div>,
    enableColumnFilter: true,
    columnType: "select",
    filterOptions: Object.entries(PlanNameMap).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    accessorKey: "plan_status",
    columnType: "select",
    header: "Plan Status",
    enableColumnFilter: true,
    cell: ({ getValue }) => <div>{PlanStatusMap[getValue()]}</div>,
    filterOptions: Object.entries(PlanStatusMap).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    accessorKey: "is_kyc_verified",
    header: "KYC Verified",
    cell: ({ getValue }) => <div>{getValue() ? "Yes" : "No"}</div>,
    columnType: "select",
    enableColumnFilter: true,
    filterOptions: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ getValue }) => <div>{getValue()}</div>,
    columnType: "text",
    enableColumnFilter: true,
    enableHiding: true,
  },
  {
    accessorKey: "plan_start_date",
    columnType: "date",
    header: "Start Date",
    enableHiding: true,
    enableSorting: true,
    defaultVisibility: false,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
  {
    accessorKey: "plan_end_date",
    columnType: "date",
    header: "End Date",
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },

  {
    accessorKey: "created_at",
    columnType: "date",
    header: "Created At",
    enableHiding: true,
    defaultVisibility: false,
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
];

export const getData = async (): Promise<OrgBilling[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const paginatedData = Array.from(
        { length: 10 },
        (): OrgBilling => ({
          org_name: faker.company.name(),
          billing_email: faker.internet.email(),
          country: faker.location.country(),
          plan_name: faker.helpers.arrayElement([
            "standard",
            "professional",
            "enterprise",
          ]),
          plan_start_date: faker.date
            .past({ years: 7 })
            .toISOString()
            .split("T")[0], // Random date in past 7 years
          plan_end_date: faker.date
            .future({ years: 2 })
            .toISOString()
            .split("T")[0], // Random date in future 2 years
          plan_status: faker.helpers.arrayElement([
            "active",
            "cancelled",
            "trialing",
          ]),
          created_at: faker.date.past({ years: 7 }).toISOString().split("T")[0],
          is_kyc_verified: faker.datatype.boolean(),
        })
      );
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

  useEffect(() => {
    onLoadMore();
  }, []);

  function onTableQueryChange(tableQuery: DataTableQuery) {
    console.log("Table query changed", tableQuery);
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
          mode="client"
          isLoading={isLoading}
          defaultSort={{ key: "name", order: "asc" }}
          onTableQueryChange={onTableQueryChange}
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
