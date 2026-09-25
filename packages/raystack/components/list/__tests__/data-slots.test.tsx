import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { List } from '../index';

describe('List data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <List>
        <List.Header>Header</List.Header>
        <List.Item>
          <List.Label>Label</List.Label>
          <List.Value>Value</List.Value>
        </List.Item>
      </List>
    );
    expectSlots(container, [
      'list',
      'list-header',
      'list-header-text',
      'list-item',
      'list-label',
      'list-value'
    ]);
  });
});
