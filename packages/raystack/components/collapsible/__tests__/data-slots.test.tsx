import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { Collapsible } from '../collapsible';

describe('Collapsible data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Panel>Panel content</Collapsible.Panel>
      </Collapsible>
    );
    expectSlots(container, [
      'collapsible',
      'collapsible-trigger',
      'collapsible-panel'
    ]);
  });
});
