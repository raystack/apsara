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
});
