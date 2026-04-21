'use client';

import { TransformIcon } from '@radix-ui/react-icons';
import {
  Button,
  Checkbox,
  Chip,
  DataTable,
  type DataTableColumnDef,
  FloatingActions,
  useDataTable
} from '@raystack/apsara';
import { useEffect, useMemo } from 'react';

type Row = {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
};

const names = [
  'Alice Ross',
  'Bob Evans',
  'Clara Patel',
  'David Kim',
  'Elena Moreno',
  'Finn O’Connor',
  'Grace Tan',
  'Henry Novak',
  'Ivy Chen',
  'Jason Park'
];
const roles = ['Admin', 'Editor', 'Viewer'];
const teams = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales'];

const selectionColumn: DataTableColumnDef<Row, unknown> = {
  id: 'select',
  accessorKey: 'select',
  header: '',
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={value => row.toggleSelected(Boolean(value))}
      aria-label='Select row'
      onClick={e => e.stopPropagation()}
    />
  ),
  enableColumnFilter: false,
  enableSorting: false,
  enableHiding: false,
  styles: {
    cell: { width: 40, flex: 'none' },
    header: { width: 40, flex: 'none' }
  }
};

const columns: DataTableColumnDef<Row, unknown>[] = [
  selectionColumn,
  { accessorKey: 'name', header: 'Name', enableColumnFilter: true },
  { accessorKey: 'email', header: 'Email', enableColumnFilter: true },
  { accessorKey: 'role', header: 'Role', enableColumnFilter: true },
  { accessorKey: 'team', header: 'Team', enableColumnFilter: true }
];

function InitialSelection() {
  const { table } = useDataTable();
  useEffect(() => {
    table.setRowSelection({ '1': true, '3': true });
  }, [table]);
  return null;
}

function SelectionBar() {
  const { table } = useDataTable();
  const selected = table.getSelectedRowModel().rows;
  if (selected.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'var(--rs-space-9)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2
      }}
    >
      <FloatingActions aria-label='Selection actions'>
        <Chip
          variant='outline'
          size='large'
          color='neutral'
          leadingIcon={<TransformIcon />}
          isDismissible
          onDismiss={() => table.resetRowSelection()}
        >
          {selected.length} selected
        </Chip>
        <FloatingActions.Separator />
        <Button variant='outline' color='neutral' size='small'>
          Move to
        </Button>
        <Button variant='outline' color='neutral' size='small'>
          Actions
        </Button>
      </FloatingActions>
    </div>
  );
}

const DataTableSelectionDemo = () => {
  const data = useMemo<Row[]>(
    () =>
      Array.from({ length: 80 }, (_, i) => {
        const name = names[i % names.length];
        const handle = name.toLowerCase().replace(/[^a-z]/g, '');
        return {
          id: String(i + 1),
          name,
          email: `${handle}${i + 1}@example.com`,
          role: roles[i % roles.length],
          team: teams[i % teams.length]
        };
      }),
    []
  );

  return (
    <div
      style={{
        position: 'relative',
        height: 760,
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <DataTable
        data={data}
        columns={columns}
        mode='client'
        defaultSort={{ name: 'name', order: 'asc' }}
        getRowId={row => row.id}
      >
        <DataTable.Toolbar />
        <DataTable.Content classNames={{ root: 'dt-selection-demo-scroll' }} />
        <InitialSelection />
        <SelectionBar />
      </DataTable>
      <style>{`.dt-selection-demo-scroll { padding-bottom: 160px; }`}</style>
    </div>
  );
};

export default DataTableSelectionDemo;
