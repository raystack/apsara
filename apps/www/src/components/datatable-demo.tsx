import {
  Checkbox,
  DataTable,
  DataTableColumnDef,
  Flex,
  Switch,
  Text
} from '@raystack/apsara';
import { useMemo, useState } from 'react';

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
    accessorKey: 'select',
    header: '',
    cell: ({ row }) => (
      <Flex align='center' justify='center' width='full'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </Flex>
    ),
    enableSorting: false,
    enableHiding: false,
    styles: {
      header: { width: 50, flex: 'none' },
      cell: { width: 50, flex: 'none' }
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('status')}</div>
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
    filterType: 'multiselect',
    enableColumnFilter: true,
    enableHiding: true,
    styles: {
      header: { width: 120, flex: 'none' },
      cell: { width: 120, flex: 'none' }
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>
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
  const [virtualized, setVirtualized] = useState(true);

  const data = useMemo(() => generateData(100), []);

  return (
    <Flex direction='column' gap='4' width='full'>
      <Flex align='center' gap='2'>
        <Switch checked={virtualized} onCheckedChange={setVirtualized} />
        <Text>Virtualized (100 rows)</Text>
      </Flex>
      <div style={{ height: 400 }}>
        <DataTable
          data={data}
          mode='client'
          columns={columns}
          defaultSort={{ name: 'email', order: 'asc' }}
        >
          <DataTable.Toolbar />
          {virtualized ? (
            <DataTable.VirtualizedContent rowHeight={44.5} />
          ) : (
            <DataTable.Content />
          )}
        </DataTable>
      </div>
    </Flex>
  );
};

export default DataTableDemo;
