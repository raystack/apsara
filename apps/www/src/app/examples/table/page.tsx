'use client';
import {
  Button,
  DataTable,
  DataTableColumnDef,
  DataTableQuery,
  Flex,
  IconButton
} from '@raystack/apsara';
import { FilterIcon } from '@raystack/apsara/icons';
import { useMemo, useState } from 'react';

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    amount: 316,
    status: 'success',
    email: 'ken99@yahoo.com'
  },
  {
    id: '3u1reuv4',
    amount: 242,
    status: 'success',
    email: 'Abe45@gmail.com'
  },
  {
    id: 'derv1ws0',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@gmail.com'
  },
  {
    id: '5kma53ae',
    amount: 874,
    status: 'success',
    email: 'Silas22@gmail.com'
  },
  {
    id: 'bhqecj4p',
    amount: 721,
    status: 'failed',
    email: 'carmella@hotmail.com'
  }
];

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
    enableColumnFilter: true
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
    enableColumnFilter: true,
    filterType: 'number'
  }
];

const Page = () => {
  const [tableQuery, setTableQuery] = useState<DataTableQuery>();
  console.log('tableQuery>> ', tableQuery);

  const filteredData = useMemo(() => {
    const filters = tableQuery?.filters?.map(filter => filter.name) || [];
    return data.filter(item => {
      let shouldShow = true;
      if (filters.includes('email')) {
        shouldShow = item.email.includes(
          tableQuery?.filters?.[filters.indexOf('email')]?.value || ''
        );
      }
      if (shouldShow && filters.includes('amount')) {
        shouldShow =
          item.amount ===
          tableQuery?.filters?.[filters.indexOf('amount')]?.value;
      }
      if (shouldShow && filters.includes('status')) {
        shouldShow = tableQuery?.filters?.[
          filters.indexOf('status')
        ]?.value.includes(item.status);
      }
      return shouldShow;
    });
  }, [tableQuery]);

  return (
    <Flex
      style={{
        height: '100vh',
        width: '100%',
        backgroundColor: 'var(--rs-color-background-base-primary)',
        padding: '32px'
      }}
    >
      <Flex direction='column' gap={4}>
        <DataTable
          data={filteredData}
          mode='server'
          columns={columns}
          query={tableQuery}
          onTableQueryChange={setTableQuery}
          defaultSort={{ name: 'email', order: 'asc' }}
        >
          <DataTable.Filters
            trigger={({ appliedFilters }) =>
              appliedFilters.size > 0 ? (
                <IconButton size={4}>
                  <FilterIcon />
                </IconButton>
              ) : (
                <Button
                  variant='outline'
                  size='small'
                  leadingIcon={<FilterIcon />}
                  color='neutral'
                >
                  Filter
                </Button>
              )
            }
          />
          {filteredData.map(item => (
            <div
              key={item.id}
            >{`${item.email} - ${item.amount} - ${item.status}`}</div>
          ))}
        </DataTable>
      </Flex>
    </Flex>
  );
};

export default Page;
