import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataTable } from '../data-table';
import styles from '../data-table.module.css';
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

const mockColumns: DataTableColumnDef<TestData, unknown>[] = [
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

  describe('Row Interaction', () => {
    it('handles row click events', async () => {
      const onRowClick = vi.fn();
      const user = userEvent.setup();

      const { container } = render(
        <DataTable
          data={mockData}
          columns={mockColumns}
          onRowClick={onRowClick}
        >
          <DataTable.Content />
        </DataTable>
      );

      const row = container.querySelectorAll('tr')[1];
      await user.click(row);
      expect(onRowClick).toHaveBeenCalled();
    });
  });

  describe('Component Composition', () => {
    it('renders with toolbar', () => {
      const { container } = render(
        <DataTable data={mockData} columns={mockColumns}>
          <DataTable.Toolbar />
          <DataTable.Content />
        </DataTable>
      );

      expect(
        container.querySelector(`div.${styles.toolbar}`)
      ).toBeInTheDocument();
    });

    it('renders with search', () => {
      render(
        <DataTable data={mockData} columns={mockColumns}>
          <DataTable.Search />
          <DataTable.Content />
        </DataTable>
      );

      expect(screen.getByLabelText('Search')).toBeInTheDocument();
    });
  });

  describe('Zero State and Empty State', () => {
    const columnsWithFilters: DataTableColumnDef<TestData, unknown>[] = [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        cell: ({ getValue }) => getValue(),
        enableColumnFilter: true
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => getValue(),
        enableColumnFilter: true
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => getValue(),
        enableColumnFilter: true
      }
    ];

    it('shows zero state when no data and no filters/search applied', () => {
      const zeroStateText = 'No data available';
      render(
        <DataTable
          data={[]}
          columns={columnsWithFilters}
          defaultSort={{ name: 'name', order: 'asc' }}
        >
          <DataTable.Toolbar />
          <DataTable.Content
            zeroState={<div data-testid='zero-state'>{zeroStateText}</div>}
            emptyState={<div data-testid='empty-state'>No results found</div>}
          />
        </DataTable>
      );

      expect(screen.getByTestId('zero-state')).toBeInTheDocument();
      expect(screen.getByText(zeroStateText)).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    });

    it('hides filter bar in zero state (no data, no filters/search)', () => {
      const { container } = render(
        <DataTable
          data={[]}
          columns={columnsWithFilters}
          defaultSort={{ name: 'name', order: 'asc' }}
        >
          <DataTable.Toolbar />
          <DataTable.Content zeroState={<div>No data</div>} />
        </DataTable>
      );

      // Toolbar should not be rendered when shouldShowFilters is false
      expect(
        container.querySelector(`div.${styles.toolbar}`)
      ).not.toBeInTheDocument();
    });

    it('shows empty state when filters are applied but no results', () => {
      const emptyStateText = 'No results found';

      // Apply a filter that will result in no matches using ilike operator
      render(
        <DataTable
          data={mockData}
          columns={columnsWithFilters}
          defaultSort={{ name: 'name', order: 'asc' }}
          query={{
            filters: [
              {
                name: 'name',
                operator: 'ilike',
                value: 'NonExistentName',
                stringValue: '%NonExistentName%'
              }
            ]
          }}
        >
          <DataTable.Toolbar />
          <DataTable.Content
            zeroState={<div data-testid='zero-state'>No data</div>}
            emptyState={<div data-testid='empty-state'>{emptyStateText}</div>}
          />
        </DataTable>
      );

      // After applying filter with no matches, empty state should show
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText(emptyStateText)).toBeInTheDocument();
      expect(screen.queryByTestId('zero-state')).not.toBeInTheDocument();
      // Data should not be visible
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('shows filter bar when filters are applied (empty state scenario)', () => {
      const { container } = render(
        <DataTable
          data={mockData}
          columns={columnsWithFilters}
          defaultSort={{ name: 'name', order: 'asc' }}
          query={{
            filters: [
              {
                name: 'name',
                operator: 'ilike',
                value: 'NonExistent',
                stringValue: '%NonExistent%'
              }
            ]
          }}
        >
          <DataTable.Toolbar />
          <DataTable.Content
            zeroState={<div>No data</div>}
            emptyState={<div>No results</div>}
          />
        </DataTable>
      );

      // Toolbar should be visible when filters are applied
      expect(
        container.querySelector(`div.${styles.toolbar}`)
      ).toBeInTheDocument();
    });

    it('shows empty state when search is applied but no results', () => {
      const emptyStateText = 'No search results';

      render(
        <DataTable
          data={mockData}
          columns={columnsWithFilters}
          defaultSort={{ name: 'name', order: 'asc' }}
          query={{
            search: 'NonExistentSearchTerm'
          }}
        >
          <DataTable.Toolbar />
          <DataTable.Content
            zeroState={<div data-testid='zero-state'>No data</div>}
            emptyState={<div data-testid='empty-state'>{emptyStateText}</div>}
          />
        </DataTable>
      );

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText(emptyStateText)).toBeInTheDocument();
      expect(screen.queryByTestId('zero-state')).not.toBeInTheDocument();
    });

    it('shows filter bar when search is applied (empty state scenario)', () => {
      const { container } = render(
        <DataTable
          data={mockData}
          columns={columnsWithFilters}
          defaultSort={{ name: 'name', order: 'asc' }}
          query={{
            search: 'test'
          }}
        >
          <DataTable.Toolbar />
          <DataTable.Content
            zeroState={<div>No data</div>}
            emptyState={<div>No results</div>}
          />
        </DataTable>
      );

      // Toolbar should be visible when search is applied
      expect(
        container.querySelector(`div.${styles.toolbar}`)
      ).toBeInTheDocument();
    });

    it('falls back to emptyState when zeroState is not provided', () => {
      const emptyStateText = 'Fallback empty state';

      render(
        <DataTable
          data={[]}
          columns={columnsWithFilters}
          defaultSort={{ name: 'name', order: 'asc' }}
        >
          <DataTable.Toolbar />
          <DataTable.Content
            emptyState={<div data-testid='empty-state'>{emptyStateText}</div>}
          />
        </DataTable>
      );

      // Should show emptyState as fallback
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText(emptyStateText)).toBeInTheDocument();
    });

    it('falls back to default empty component when neither zeroState nor emptyState provided', () => {
      render(
        <DataTable
          data={[]}
          columns={columnsWithFilters}
          defaultSort={{ name: 'name', order: 'asc' }}
        >
          <DataTable.Toolbar />
          <DataTable.Content />
        </DataTable>
      );

      // Should show default empty state
      expect(screen.getByText('No Data')).toBeInTheDocument();
    });

    it('shows data normally when filters/search match results', () => {
      render(
        <DataTable
          data={mockData}
          columns={columnsWithFilters}
          defaultSort={{ name: 'name', order: 'asc' }}
          query={{
            search: 'John'
          }}
        >
          <DataTable.Toolbar />
          <DataTable.Content
            zeroState={<div data-testid='zero-state'>No data</div>}
            emptyState={<div data-testid='empty-state'>No results</div>}
          />
        </DataTable>
      );

      // Should show matching data, not empty state
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
      expect(screen.queryByTestId('zero-state')).not.toBeInTheDocument();
    });

    it('shows filter bar when data exists', () => {
      const { container } = render(
        <DataTable
          data={mockData}
          columns={columnsWithFilters}
          defaultSort={{ name: 'name', order: 'asc' }}
        >
          <DataTable.Toolbar />
          <DataTable.Content />
        </DataTable>
      );

      // Toolbar should be visible when data exists
      expect(
        container.querySelector(`div.${styles.toolbar}`)
      ).toBeInTheDocument();
    });
  });
});
