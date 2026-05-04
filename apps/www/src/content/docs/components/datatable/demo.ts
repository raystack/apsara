'use client';

export const preview = {
  type: 'code',
  style: {
    padding: 0
  },
  previewCode: false,
  code: `<DataTableDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      <DataTable
        data={data}
        mode="client"
        columns={columns}
        defaultSort={{ name: "email", order: "asc" }}>
        <DataTable.Toolbar />
        <DataTable.Content />
      </DataTable>`
    }
  ]
};

export const virtualizedPreview = {
  type: 'code',
  style: {
    padding: 0
  },
  previewCode: false,
  code: `<DataTableVirtualizedDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
      /* Parent container must have a fixed height */
      <div style={{ height: 400 }}>
        <DataTable
          data={data}
          mode="client"
          columns={columns}
          defaultSort={{ name: "email", order: "asc" }}>
          <DataTable.Toolbar />
          <DataTable.VirtualizedContent rowHeight={44.5} />
        </DataTable>
      </div>`
    }
  ]
};

export const rowSelectionDemo = {
  type: 'code',
  previewCode: false,
  code: `<DataTableSelectionDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `import {
  Button,
  Checkbox,
  Chip,
  DataTable,
  FloatingActions,
  useDataTable,
} from "@raystack/apsara";
import { TransformIcon } from "@radix-ui/react-icons";

// 1. Leading checkbox column that wires TanStack selection.
const selectionColumn = {
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllRowsSelected()
          ? true
          : table.getIsSomeRowsSelected()
          ? "indeterminate"
          : false
      }
      onCheckedChange={(v) => table.toggleAllRowsSelected(Boolean(v))}
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(v) => row.toggleSelected(Boolean(v))}
      onClick={(e) => e.stopPropagation()}
    />
  ),
  enableSorting: false,
  enableColumnFilter: false,
  enableHiding: false,
};

// 2. Render the bar alongside DataTable, reading selection from context.
//    FloatingActions defaults to variant="floating" (position: fixed,
//    bottom-center), so no positioning CSS is needed here.
function SelectionBar() {
  const { table } = useDataTable();
  const selected = table.getSelectedRowModel().rows;
  if (selected.length === 0) return null;

  return (
    <FloatingActions aria-label="Selection actions">
      <Chip
        variant="outline"
        size="large"
        color="neutral"
        leadingIcon={<TransformIcon />}
        isDismissible
        onDismiss={() => table.resetRowSelection()}
      >
        {selected.length} selected
      </Chip>
      <FloatingActions.Separator />
      <Button variant="outline" color="neutral" size="small">
        Move to
      </Button>
      <Button variant="outline" color="neutral" size="small">
        Actions
      </Button>
    </FloatingActions>
  );
}

// 3. Compose.
<DataTable
  data={rows}
  columns={[selectionColumn, ...columns]}
  mode="client"
  defaultSort={{ name: "name", order: "asc" }}
>
  <DataTable.Toolbar />
  <DataTable.Search />
  <DataTable.Content />
  <SelectionBar />
</DataTable>`
    }
  ]
};
