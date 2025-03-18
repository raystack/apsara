import {
  Container,
  DataTable,
  DataTableColumnDef,
  DataTableQuery,
  EmptyFilterValue,
  Flex,
  Separator,
  Switch,
  Text,
} from "@raystack/apsara/v1";
import { faker } from "@faker-js/faker";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

type PlanStatus = "active" | "cancelled" | "trialing";
type PlanName = "" | "professional" | "enterprise";

interface OrgBilling {
  org_name: string;
  billing_email: string;
  country: string;
  user_count: number;
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
  "": "Standard",
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
    styles: {
      cell: {
        paddingLeft: "16px",
      },
      header: {
        paddingLeft: "16px",
      },
    },
  },
  {
    accessorKey: "billing_email",
    header: "Email",
    enableHiding: true,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
  {
    accessorKey: "plan_name",
    header: "Plan Name",
    cell: ({ getValue }) => <div>{PlanNameMap[getValue()]}</div>,
    enableColumnFilter: true,
    filterType: "select",
    filterOptions: Object.entries(PlanNameMap).map(([value, label]) => ({
      value: value === "" ? EmptyFilterValue : value,
      label,
    })),
  },
  {
    accessorKey: "plan_status",
    filterType: "select",
    header: "Plan Status",
    enableColumnFilter: true,
    cell: ({ getValue }) => <div>{PlanStatusMap[getValue()]}</div>,
    filterOptions: Object.entries(PlanStatusMap).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    accessorKey: "user_count",
    header: "User Count",
    cell: ({ getValue }) => <div>{getValue()}</div>,
    filterType: "number",
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: "is_kyc_verified",
    header: "KYC Verified",
    cell: ({ getValue }) => <div>{getValue() ? "Yes" : "No"}</div>,
    filterType: "select",
    enableColumnFilter: true,
    filterOptions: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
    enableGrouping: true,
    showGroupCount: true,
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ getValue }) => <div>{getValue()}</div>,
    enableColumnFilter: true,
    enableHiding: true,
  },
  {
    accessorKey: "plan_start_date",
    filterType: "date",
    header: "Start Date",
    enableHiding: true,
    enableSorting: true,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
  {
    accessorKey: "plan_end_date",
    filterType: "date",
    header: "End Date",
    defaultHidden: true,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },

  {
    accessorKey: "created_at",
    filterType: "date",
    header: "Created At",
    enableHiding: true,
    defaultHidden: true,
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
];
const mockData = Array.from(
  { length: 100 },
  (): OrgBilling => ({
    org_name: faker.company.name(),
    billing_email: faker.internet.email(),
    country: faker.location.country(),
    user_count: faker.number.int({ min: 10, max: 100 }),
    plan_name: faker.helpers.arrayElement(["", "professional", "enterprise"]),
    plan_start_date: dayjs(faker.date.past({ years: 7 })).format("YYYY-MM-DD"),
    plan_end_date: dayjs(faker.date.future({ years: 2 })).format("YYYY-MM-DD"),
    plan_status: faker.helpers.arrayElement([
      "active",
      "cancelled",
      "trialing",
    ]),
    created_at: dayjs(faker.date.past({ years: 7 })).format("YYYY-MM-DD"),
    is_kyc_verified: faker.datatype.boolean(),
  })
);

interface Resp {
  data: OrgBilling[];
  query: DataTableQuery;
}

export const getData = async (query: DataTableQuery): Promise<Resp> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = mockData;
      // Filtering
      if (query.filters && query.filters.length) {
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
                console.log(dayjs(value));
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
      if (query.sort && query.sort.length) {
        query.sort.forEach(({ name, order }) => {
          data.sort((a, b) => {
            const valA = a[name];
            const valB = b[name];
            const sortValue =
              typeof valA === "string" ? valA.localeCompare(valB) : valA - valB;
            return order === "asc" ? sortValue : -1 * sortValue;
          });
        });
      }

      // Pagination
      if (query.offset !== undefined && query.limit !== undefined) {
        if (query.offset * query.limit >= data.length) {
          data = [];
        } else {
          data = data.slice(query.offset, query.offset + query.limit);
        }
      }

      resolve({ data, query });
    }, 1000);
  });
};

const LIMIT = 20;

export default function DataTableExample() {
  const [data, setData] = useState<OrgBilling[]>([]);
  const [isSeverMode, setIsSeverMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [query, setQuery] = useState<DataTableQuery>({
    limit: LIMIT,
  } as DataTableQuery);

  const loadData = useCallback(
    async (rqlQuery: DataTableQuery, reset = false) => {
      if (isLoading || !hasMoreData) return;
      try {
        setIsLoading(true);
        const resp = await getData(rqlQuery);
        setData((prev) => (reset ? resp.data : [...prev, ...resp.data]));
        setQuery(resp.query);
        setHasMoreData(resp.data.length > 0);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasMoreData]
  );

  useEffect(() => {
    setData([]);
    const newQuery = isSeverMode ? { offset: 1, limit: LIMIT } : {};
    loadData(newQuery, true);
  }, [isSeverMode]);

  async function onTableQueryChange(tableQuery: DataTableQuery) {
    setData([]);
    setQuery(tableQuery);
    setHasMoreData(true);
    console.log("Table query changed", tableQuery);
    loadData(tableQuery, true);
  }

  async function onLoadMore() {
    const newOffset = query.offset || !isNaN(query.offset) ? query.offset : 0;
    loadData(
      {
        ...query,
        offset: newOffset + 1,
      },
      false
    );
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
          mode={isSeverMode ? "server" : "client"}
          query={query}
          isLoading={isLoading}
          defaultSort={{ name: "org_name", order: "asc" }}
          onTableQueryChange={onTableQueryChange}
          onLoadMore={onLoadMore}
        >
          <Flex style={{ padding: "16px" }}>
            <Flex style={{ flex: 1 }} gap={3} align="center">
              <Text>Client</Text>
              <Switch
                checked={isSeverMode}
                onCheckedChange={() => setIsSeverMode((prev) => !prev)}
              />
              <Text>Server</Text>
            </Flex>
            <Flex style={{ flex: 1 }}>
              <DataTable.Search />
            </Flex>
          </Flex>
          <Separator />
          <DataTable.Toolbar />
          <DataTable.Content />
        </DataTable>
      </Container>
    </>
  );
}
