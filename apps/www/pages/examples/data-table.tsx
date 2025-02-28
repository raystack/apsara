import {
  Container,
  DataTable,
  DataTableColumnDef,
  DataTableQuery,
  Flex,
  Separator,
} from "@raystack/apsara/v1";
import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

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
    enableGrouping: true,
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
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
  {
    accessorKey: "plan_end_date",
    columnType: "date",
    header: "End Date",
    defaultHidden: true,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },

  {
    accessorKey: "created_at",
    columnType: "date",
    header: "Created At",
    enableHiding: true,
    defaultHidden: true,
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
];
faker.seed(1234);
export const getData = async (query: DataTableQuery): Promise<OrgBilling[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = Array.from(
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
          plan_start_date: dayjs(faker.date.past({ years: 7 })).format(
            "YYYY-MM-DD"
          ),
          plan_end_date: dayjs(faker.date.future({ years: 2 })).format(
            "YYYY-MM-DD"
          ),
          plan_status: faker.helpers.arrayElement([
            "active",
            "cancelled",
            "trialing",
          ]),
          created_at: dayjs(faker.date.past({ years: 7 })).format("YYYY-MM-DD"),
          is_kyc_verified: faker.datatype.boolean(),
        })
      );

      // Filtering
      if (query.filters) {
        query.filters.forEach(({ name, operator, value }) => {
          data = data.filter((item) => {
            switch (operator) {
              case "eq":
                return item[name] == value;
              case "neq":
                return item[name] != value;
              case "lt":
                return dayjs(item[name]).isBefore(dayjs(value));
              case "lte":
                return dayjs(item[name]).isSameOrBefore(dayjs(value));
              case "gt":
                return dayjs(item[name]).isAfter(dayjs(value));
              case "gte":
                return dayjs(item[name]).isSameOrAfter(dayjs(value));
              case "like":
                return item[name].toString().includes(value);
              default:
                return true;
            }
          });
        });
      }

      // Sorting
      if (query.sort) {
        query.sort.forEach(({ key, order }) => {
          data.sort((a, b) => {
            const valA = a[key];
            const valB = b[key];
            return order === "asc"
              ? valA.localeCompare(valB)
              : valB.localeCompare(valA);
          });
        });
      }

      // Pagination
      if (query.offset !== undefined && query.limit !== undefined) {
        data = data.slice(query.offset, query.offset + query.limit);
      }

      resolve(data);
    }, 1000);
  });
};

export default function DataTableExample() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [query, setQuery] = useState<DataTableQuery>({} as DataTableQuery);

  async function onLoadMore(reset = false) {
    if (isLoading) return;
    try {
      setIsLoading(true);
      console.log("Loading more data", query);
      const newData = await getData(query);
      setData((prev) => (reset ? newData : [...prev, ...newData]));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    onLoadMore();
  }, [query]);

  async function onTableQueryChange(tableQuery: DataTableQuery) {
    setQuery(tableQuery);
    onLoadMore(true);
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
          defaultSort={{ key: "org_name", order: "asc" }}
          onTableQueryChange={onTableQueryChange}
          onLoadMore={onLoadMore}
        >
          <Flex style={{ padding: "16px" }}>
            <DataTable.Search />
          </Flex>
          <Separator />
          <DataTable.Toolbar />
          <DataTable.Content />
        </DataTable>
      </Container>
    </>
  );
}
