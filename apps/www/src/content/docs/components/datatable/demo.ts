'use client';

export const preview = {
  type: 'code',
  code: `<DataTableDemo />`
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

// 2. Render the overlay bar alongside DataTable, reading selection from context.
function SelectionBar() {
  const { table } = useDataTable();
  const selected = table.getSelectedRowModel().rows;
  if (selected.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "var(--rs-space-9)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2,
      }}
    >
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
    </div>
  );
}

// 3. Compose. The wrapping element must be \`position: relative\` so the
// overlay anchors to the table region (not the viewport).
<div style={{ position: "relative", flex: 1, minHeight: 0 }}>
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
  </DataTable>
</div>`
    }
  ]
};
