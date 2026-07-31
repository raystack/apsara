import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { Accordion } from '../accordion';

describe('Accordion data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Accordion defaultValue='item-1'>
        <Accordion.Item value='item-1'>
          <Accordion.Trigger>Trigger</Accordion.Trigger>
          <Accordion.Content>Content</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );
    expectSlots(container, [
      'accordion',
      'accordion-item',
      'accordion-header',
      'accordion-trigger',
      'accordion-trigger-icon',
      'accordion-content',
      'accordion-content-inner'
    ]);
  });
});
