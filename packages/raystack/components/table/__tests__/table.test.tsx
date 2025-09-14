import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../../../test-utils';
import { Table } from '../table';
import styles from '../table.module.css';

describe('Table', () => {
  describe('Table Root', () => {
    it('renders as table element', () => {
      render(<Table>Content</Table>);
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Table ref={ref}>Content</Table>);
      expect(ref).toHaveBeenCalled();
    });

    it('applies table class', () => {
      render(<Table>Content</Table>);
      const table = screen.getByRole('table');
      expect(table).toHaveClass(styles.table);
    });

    it('applies custom className', () => {
      render(<Table className='custom-table'>Content</Table>);
      const table = screen.getByRole('table');
      expect(table).toHaveClass('custom-table');
      expect(table).toHaveClass(styles.table);
    });

    it('supports HTML table attributes', () => {
      render(
        <Table id='data-table' data-testid='test-table'>
          Content
        </Table>
      );
      const table = screen.getByTestId('test-table');
      expect(table).toHaveAttribute('id', 'data-table');
    });
  });

  describe('Table.Header', () => {
    it('renders as thead element', () => {
      render(
        <Table>
          <Table.Header>Header Content</Table.Header>
        </Table>
      );
      const thead = screen.getByRole('table').querySelector('thead');
      expect(thead).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Table>
          <Table.Header ref={ref}>Header</Table.Header>
        </Table>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('applies header class', () => {
      render(
        <Table>
          <Table.Header>Header</Table.Header>
        </Table>
      );
      const thead = screen.getByRole('table').querySelector('thead');
      expect(thead).toHaveClass(styles.header);
    });

    it('applies custom className', () => {
      render(
        <Table>
          <Table.Header className='custom-header'>Header</Table.Header>
        </Table>
      );
      const thead = screen.getByRole('table').querySelector('thead');
      expect(thead).toHaveClass('custom-header');
      expect(thead).toHaveClass(styles.header);
    });
  });

  describe('Table.Body', () => {
    it('renders as tbody element', () => {
      render(
        <Table>
          <Table.Body>Body Content</Table.Body>
        </Table>
      );
      const tbody = screen.getByRole('table').querySelector('tbody');
      expect(tbody).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Table>
          <Table.Body ref={ref}>Body</Table.Body>
        </Table>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('renders children', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
      expect(screen.getByText('Cell')).toBeInTheDocument();
    });
  });

  describe('Table.Row', () => {
    it('renders as tr element', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>Row Content</Table.Row>
          </Table.Body>
        </Table>
      );
      const row = screen.getByRole('row');
      expect(row).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Table>
          <Table.Body>
            <Table.Row ref={ref}>Row</Table.Row>
          </Table.Body>
        </Table>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('supports onClick event', () => {
      const handleClick = vi.fn();
      render(
        <Table>
          <Table.Body>
            <Table.Row onClick={handleClick}>
              <Table.Cell>Click me</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
      const row = screen.getByRole('row');
      row.click();
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Table.Head', () => {
    it('renders as th element', () => {
      render(
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Header Cell</Table.Head>
            </Table.Row>
          </Table.Header>
        </Table>
      );
      const th = screen.getByRole('columnheader');
      expect(th).toBeInTheDocument();
      expect(th).toHaveTextContent('Header Cell');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head ref={ref}>Header</Table.Head>
            </Table.Row>
          </Table.Header>
        </Table>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('applies head class', () => {
      render(
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Header</Table.Head>
            </Table.Row>
          </Table.Header>
        </Table>
      );
      const th = screen.getByRole('columnheader');
      expect(th).toHaveClass(styles.head);
    });

    it('applies custom className', () => {
      render(
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head className='custom-head'>Header</Table.Head>
            </Table.Row>
          </Table.Header>
        </Table>
      );
      const th = screen.getByRole('columnheader');
      expect(th).toHaveClass('custom-head');
      expect(th).toHaveClass(styles.head);
    });

    it('supports scope attribute', () => {
      render(
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head scope='col'>Column Header</Table.Head>
            </Table.Row>
          </Table.Header>
        </Table>
      );
      const th = screen.getByRole('columnheader');
      expect(th).toHaveAttribute('scope', 'col');
    });
  });

  describe('Table.Cell', () => {
    it('renders as td element', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Cell Content</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
      const cell = screen.getByRole('cell');
      expect(cell).toBeInTheDocument();
      expect(cell).toHaveTextContent('Cell Content');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell ref={ref}>Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('applies cell class', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
      const cell = screen.getByRole('cell');
      expect(cell).toHaveClass(styles.cell);
    });

    it('applies custom className', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell className='custom-cell'>Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
      const cell = screen.getByRole('cell');
      expect(cell).toHaveClass('custom-cell');
      expect(cell).toHaveClass(styles.cell);
    });

    it('supports colSpan attribute', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan={2}>Spanning Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
      const cell = screen.getByRole('cell');
      expect(cell).toHaveAttribute('colspan', '2');
    });

    it('supports rowSpan attribute', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell rowSpan={3}>Spanning Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
      const cell = screen.getByRole('cell');
      expect(cell).toHaveAttribute('rowspan', '3');
    });
  });

  describe('Table.SectionHeader', () => {
    it('renders as tr with th element', () => {
      render(
        <Table>
          <Table.Body>
            <Table.SectionHeader colSpan={3}>Section Title</Table.SectionHeader>
          </Table.Body>
        </Table>
      );
      const row = screen.getByRole('row');
      expect(row).toBeInTheDocument();
      expect(screen.getByText('Section Title')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Table>
          <Table.Body>
            <Table.SectionHeader ref={ref} colSpan={2}>
              Section
            </Table.SectionHeader>
          </Table.Body>
        </Table>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('applies sectionHeader class to row', () => {
      render(
        <Table>
          <Table.Body>
            <Table.SectionHeader colSpan={2}>Section</Table.SectionHeader>
          </Table.Body>
        </Table>
      );
      const row = screen.getByRole('row');
      expect(row).toHaveClass(styles.sectionHeader);
    });

    it('sets colSpan on th element', () => {
      render(
        <Table>
          <Table.Body>
            <Table.SectionHeader colSpan={5}>Section</Table.SectionHeader>
          </Table.Body>
        </Table>
      );
      const th = screen.getByRole('row').querySelector('th');
      expect(th).toHaveAttribute('colspan', '5');
    });

    it('applies custom classNames', () => {
      render(
        <Table>
          <Table.Body>
            <Table.SectionHeader
              colSpan={3}
              classNames={{
                row: 'custom-row',
                cell: 'custom-cell'
              }}
            >
              Section
            </Table.SectionHeader>
          </Table.Body>
        </Table>
      );
      const row = screen.getByRole('row');
      const th = row.querySelector('th');
      expect(row).toHaveClass('custom-row');
      expect(th).toHaveClass('custom-cell');
    });
  });

  describe('Complete Table Structure', () => {
    it('renders complete table with all components', () => {
      render(
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Email</Table.Head>
              <Table.Head>Status</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.SectionHeader colSpan={3}>Active Users</Table.SectionHeader>
            <Table.Row>
              <Table.Cell>John Doe</Table.Cell>
              <Table.Cell>john@example.com</Table.Cell>
              <Table.Cell>Active</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Jane Smith</Table.Cell>
              <Table.Cell>jane@example.com</Table.Cell>
              <Table.Cell>Active</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(4); // 3 from header + 1 from section header
      expect(screen.getByText('Active Users')).toBeInTheDocument();
      expect(screen.getAllByRole('cell')).toHaveLength(6);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('supports complex cell content', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <div>
                  <strong>Complex</strong>
                  <span>Content</span>
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );

      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
