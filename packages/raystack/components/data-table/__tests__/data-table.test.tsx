import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../../../test-utils';
import { DataTable } from '../data-table';
import { DataTableColumnDef } from '../data-table.types';

interface TestData {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const mockData: TestData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' }
];

const mockColumns: DataTableColumnDef<TestData>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    cell: ({ getValue }) => getValue()
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    cell: ({ getValue }) => getValue()
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => getValue()
  }
];

describe('DataTable', () => {
  describe('Basic Rendering', () => {
    it('renders data table with content', () => {
      render(
        <DataTable data={mockData} columns={mockColumns}>
          <DataTable.Content />
        </DataTable>
      );

      // Table should be rendered
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('provides table context to children', () => {
      const TestComponent = () => {
        return <div data-testid='test-content'>Test</div>;
      };

      render(
        <DataTable data={mockData} columns={mockColumns}>
          <TestComponent />
        </DataTable>
      );

      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('renders with empty data', () => {
      render(
        <DataTable data={[]} columns={mockColumns}>
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('displays table data in content', () => {
      render(
        <DataTable data={mockData} columns={mockColumns}>
          <DataTable.Content />
        </DataTable>
      );

      // Check if data is displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('displays column headers', () => {
      render(
        <DataTable data={mockData} columns={mockColumns}>
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('handles loading state', () => {
      render(
        <DataTable
          data={[]}
          columns={mockColumns}
          isLoading={true}
          loadingRowCount={2}
        >
          <DataTable.Content />
        </DataTable>
      );

      // Should still render table structure while loading
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('uses default loading row count', () => {
      render(
        <DataTable data={[]} columns={mockColumns} isLoading={true}>
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Client Mode', () => {
    it('uses client mode by default', () => {
      render(
        <DataTable data={mockData} columns={mockColumns}>
          <DataTable.Content />
        </DataTable>
      );

      // Client mode should enable all data to be visible
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('handles client-side sorting', () => {
      render(
        <DataTable data={mockData} columns={mockColumns} mode='client'>
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      // Sorting functionality would be tested through interaction
    });
  });

  // describe('Server Mode', () => {
  //   it('handles server mode', () => {
  //     const onTableQueryChange = vi.fn();

  //     render(
  //       <DataTable
  //         data={mockData}
  //         columns={mockColumns}
  //         mode='server'
  //         onTableQueryChange={onTableQueryChange}
  //       >
  //         <DataTable.Content />
  //       </DataTable>
  //     );

  //     expect(screen.getByRole('table')).toBeInTheDocument();
  //   });

  //   it('calls onTableQueryChange in server mode', () => {
  //     const onTableQueryChange = vi.fn();

  //     render(
  //       <DataTable
  //         data={mockData}
  //         columns={mockColumns}
  //         mode='server'
  //         onTableQueryChange={onTableQueryChange}
  //       >
  //         <DataTable.Content />
  //       </DataTable>
  //     );

  //     // Initial query should be sent
  //     expect(onTableQueryChange).toHaveBeenCalled();
  //   });

  //   it('handles load more functionality', () => {
  //     const onLoadMore = vi.fn();

  //     render(
  //       <DataTable
  //         data={mockData}
  //         columns={mockColumns}
  //         mode='server'
  //         onLoadMore={onLoadMore}
  //       >
  //         <DataTable.Content />
  //       </DataTable>
  //     );

  //     expect(screen.getByRole('table')).toBeInTheDocument();
  //   });
  // });

  describe('Query Handling', () => {
    it('accepts initial query', () => {
      const initialQuery = {
        search: 'john'
      };

      render(
        <DataTable data={mockData} columns={mockColumns} query={initialQuery}>
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('handles default sort', () => {
      const defaultSort = {
        column: 'name',
        direction: 'asc' as const
      };

      render(
        <DataTable
          data={mockData}
          columns={mockColumns}
          defaultSort={defaultSort}
        >
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Row Interaction', () => {
    it('handles row click events', () => {
      const onRowClick = vi.fn();

      render(
        <DataTable
          data={mockData}
          columns={mockColumns}
          onRowClick={onRowClick}
        >
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      // Row click would be tested through interaction with actual rows
    });
  });

  describe('Component Composition', () => {
    it('renders with toolbar', () => {
      render(
        <DataTable data={mockData} columns={mockColumns}>
          <DataTable.Toolbar />
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('renders with search', () => {
      render(
        <DataTable data={mockData} columns={mockColumns}>
          <DataTable.Search />
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('renders complete data table structure', () => {
      render(
        <DataTable data={mockData} columns={mockColumns}>
          <DataTable.Toolbar />
          <DataTable.Search />
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Column Visibility', () => {
    it('handles column visibility', () => {
      const columnsWithVisibility = mockColumns.map((col, index) => ({
        ...col,
        meta: {
          ...col.meta,
          hidden: index === 0 // Hide first column
        }
      }));

      render(
        <DataTable data={mockData} columns={columnsWithVisibility}>
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      // The hidden column logic would be tested through the rendered output
    });
  });

  describe('Data Grouping', () => {
    it('handles grouped data', () => {
      const query = {
        group_by: ['status']
      };

      render(
        <DataTable data={mockData} columns={mockColumns} query={query}>
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('handles filters in query', () => {
      const query = {
        filters: [
          {
            column: 'status',
            operation: 'equals',
            value: 'active'
          }
        ]
      };

      render(
        <DataTable data={mockData} columns={mockColumns} query={query}>
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing data gracefully', () => {
      render(
        <DataTable columns={mockColumns}>
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('handles invalid column definitions', () => {
      const invalidColumns = [
        {
          id: 'invalid',
          header: 'Invalid Column'
          // Missing accessorKey and cell
        }
      ] as DataTableColumnDef<TestData>[];

      // Should render without crashing even with invalid columns
      render(
        <DataTable data={mockData} columns={invalidColumns}>
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('handles large datasets', () => {
      const largeData = Array.from({ length: 1000 }, (_, index) => ({
        id: index,
        name: `User ${index}`,
        email: `user${index}@example.com`,
        status: index % 2 === 0 ? ('active' as const) : ('inactive' as const)
      }));

      render(
        <DataTable data={largeData} columns={mockColumns}>
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });
});
