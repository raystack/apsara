import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { PreviewCard } from '../preview-card';

const OpenPreviewCard = ({ showArrow = false }) => (
  <PreviewCard open>
    <PreviewCard.Trigger href='#'>Hover me</PreviewCard.Trigger>
    <PreviewCard.Content showArrow={showArrow}>
      <PreviewCard.Viewport>Content</PreviewCard.Viewport>
    </PreviewCard.Content>
  </PreviewCard>
);

describe('PreviewCard data-slot contract', () => {
  it('exposes slots for every rendered part', async () => {
    render(<OpenPreviewCard showArrow />);
    // PreviewCard content portals to the body.
    await waitFor(() => {
      expectSlots(document.body, [
        'preview-card-positioner',
        'preview-card-content',
        'preview-card-viewport',
        'preview-card-arrow'
      ]);
    });
  });

  it('omits the arrow slot by default', async () => {
    render(<OpenPreviewCard />);
    await waitFor(() => {
      expect(getSlot(document.body, 'preview-card-content')).not.toBeNull();
    });
    expect(getSlot(document.body, 'preview-card-arrow')).toBeNull();
  });
});
