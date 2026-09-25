import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { SidePanel } from '../side-panel';

describe('SidePanel data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <SidePanel>
        <SidePanel.Header
          title='Title'
          icon={<span>icon</span>}
          description='Description'
          actions={[<button key='a'>Action</button>]}
        />
        <SidePanel.Section>Section content</SidePanel.Section>
      </SidePanel>
    );
    expectSlots(container, [
      'side-panel',
      'side-panel-header',
      'side-panel-header-content',
      'side-panel-title-group',
      'side-panel-title',
      'side-panel-actions',
      'side-panel-description',
      'side-panel-section'
    ]);
  });

  it('omits the description slot when none is given', () => {
    const { container } = render(
      <SidePanel>
        <SidePanel.Header title='Title' />
      </SidePanel>
    );
    expect(getSlot(container, 'side-panel-description')).toBeNull();
  });
});
