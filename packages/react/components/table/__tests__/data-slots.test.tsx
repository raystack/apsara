import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Table } from '../table';

describe('Table data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>John</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    expectSlots(container, [
      'table',
      'table-header',
      'table-body',
      'table-row',
      'table-head',
      'table-cell'
    ]);
  });

  it('reuses the row slot for section headers and adds its own cell slot', () => {
    const { container } = render(
      <Table>
        <Table.Body>
          <Table.SectionHeader colSpan={2}>Group A</Table.SectionHeader>
        </Table.Body>
      </Table>
    );
    expectSlots(container, [
      'table-section-header',
      'table-section-header-cell'
    ]);
    expect(getSlot(container, 'table-row')).toBeNull();
  });
});
