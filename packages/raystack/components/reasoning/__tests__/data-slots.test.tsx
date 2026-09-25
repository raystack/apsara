import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Reasoning } from '../reasoning';

describe('Reasoning data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Reasoning streaming defaultOpen>
        <Reasoning.Trigger />
        <Reasoning.Content>
          <Reasoning.Step label='Gathering ticket updates'>
            step detail
          </Reasoning.Step>
        </Reasoning.Content>
      </Reasoning>
    );
    expectSlots(container, [
      'reasoning',
      'reasoning-trigger',
      'reasoning-chevron',
      'reasoning-label-streaming',
      'reasoning-panel',
      'reasoning-body',
      'reasoning-step',
      'reasoning-step-label',
      'reasoning-step-body'
    ]);
  });

  it('omits the streaming label once done', () => {
    const { container } = render(
      <Reasoning streaming={false} duration={4}>
        <Reasoning.Trigger />
      </Reasoning>
    );
    expect(getSlot(container, 'reasoning-label-streaming')).toBeNull();
  });

  it('omits the step label and body slots when absent', () => {
    const { container } = render(
      <Reasoning defaultOpen>
        <Reasoning.Content>
          <Reasoning.Step />
        </Reasoning.Content>
      </Reasoning>
    );
    expect(getSlot(container, 'reasoning-step-label')).toBeNull();
    expect(getSlot(container, 'reasoning-step-body')).toBeNull();
  });
});
