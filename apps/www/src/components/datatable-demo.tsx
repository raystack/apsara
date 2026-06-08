import {
  Checkbox,
  DataTable,
  DataTableColumnDef,
  Flex
} from '@raystack/apsara';
import { useMemo } from 'react';

const statuses = ['pending', 'processing', 'success', 'failed'] as const;

const generateData = (count: number): Payment[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `row-${i}`,
    amount: Math.floor(Math.random() * 1000),
    status: statuses[i % 4],
    email: `user${i}@example.com`
  }));

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

export const columns: DataTableColumnDef<Payment, unknown>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    styles: {
      cell: {
        width: 180,
        flex: 'none',
        paddingLeft: 'var(--rs-space-7)'
      },
      header: {
        width: 180,
        flex: 'none',
        paddingLeft: 'var(--rs-space-7)'
      }
    },
    cell: ({ row }) => (
      <Flex gap={3} align='center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label='Select row'
          style={{
            display: 'block'
          }}
        />
        <div className='capitalize'>{row.getValue('status')}</div>
      </Flex>
    ),
    filterOptions: [
      {
        label: 'Pending',
        value: 'pending'
      },
      {
        label: 'Processing',
        value: 'processing'
      },
      {
        label: 'Success',
        value: 'success'
      },
      {
        label: 'Failed',
        value: 'failed'
      }
    ],
    filterType: 'select',
    enableColumnFilter: true,
    enableHiding: true,
    defaultFilterValue: '',
    filterProps: {
      select: {
        autocomplete: true
      }
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>,
    enableColumnFilter: true
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);

      return <div className='text-right font-medium'>{formatted}</div>;
    },
    enableHiding: true,
    styles: {
      header: { width: 100, flex: 'none' },
      cell: { width: 100, flex: 'none' }
    }
  }
];

const DataTableDemo = () => {
  const data = useMemo(() => generateData(100), []);
  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      <div style={{ height: 400 }}>
        <DataTable
          data={data}
          mode='client'
          columns={columns}
          defaultSort={{ name: 'email', order: 'asc' }}
        >
          <DataTable.Toolbar />
          <DataTable.Content />
        </DataTable>
      </div>
    </Flex>
  );
};

const DataTableVirtualizedDemo = () => {
  const data = useMemo(() => generateData(1000), []);

  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      <div style={{ height: 400 }}>
        <DataTable
          data={data}
          mode='client'
          columns={columns}
          defaultSort={{ name: 'email', order: 'asc' }}
        >
          <DataTable.Toolbar />
          <DataTable.VirtualizedContent rowHeight={44.5} />
        </DataTable>
      </div>
    </Flex>
  );
};

const DataTableSearchDemo = () => {
  const data = useMemo(() => generateData(50), []);

  return (
    <Flex
      direction='column'
      gap={4}
      style={{ width: '100%', height: 400, padding: '20px' }}
    >
      <DataTable
        data={data}
        mode='client'
        columns={columns}
        defaultSort={{ name: 'email', order: 'asc' }}
      >
        <DataTable.Search placeholder='Search payments…' showClearButton />
        <DataTable.Content />
      </DataTable>
    </Flex>
  );
};

export { DataTableDemo, DataTableSearchDemo, DataTableVirtualizedDemo };
