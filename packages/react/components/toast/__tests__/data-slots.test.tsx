import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Toast } from '../toast';

// Each test gets its own manager so toasts never leak between tests.
const renderProvider = () => {
  const manager = Toast.createToastManager();
  render(
    <Toast.Provider toastManager={manager}>
      <div>App content</div>
    </Toast.Provider>
  );
  return manager;
};

describe('Toast data-slot contract', () => {
  it('exposes slots for every rendered part', async () => {
    const manager = renderProvider();
    act(() => {
      manager.add({
        title: 'Saved',
        description: 'Your changes were saved',
        actionProps: { children: 'Undo' }
      });
    });
    await screen.findByText('Saved');
    // Toasts portal to the body.
    expectSlots(document.body, [
      'toast-viewport',
      'toast',
      'toast-content',
      'toast-body',
      'toast-leading-icon',
      'toast-main',
      'toast-header',
      'toast-title',
      'toast-actions',
      'toast-action',
      'toast-close',
      'toast-description'
    ]);
  });

  it('exposes positioner and arrow slots for an anchored toast', async () => {
    const manager = renderProvider();
    const anchor = screen.getByText('App content');
    act(() => {
      manager.add({ title: 'Copied', positionerProps: { anchor } });
    });
    await screen.findByText('Copied');
    expectSlots(document.body, [
      'toast-anchored-viewport',
      'toast-positioner',
      'toast-arrow'
    ]);
  });

  it('omits the positioner and arrow slots for a stacked toast', async () => {
    const manager = renderProvider();
    act(() => {
      manager.add({ title: 'Stacked' });
    });
    await screen.findByText('Stacked');
    expect(getSlot(document.body, 'toast-positioner')).toBeNull();
    expect(getSlot(document.body, 'toast-arrow')).toBeNull();
  });

  it('omits the description slot when only a title is given', async () => {
    const manager = renderProvider();
    act(() => {
      manager.add({ title: 'Title only' });
    });
    await screen.findByText('Title only');
    expect(getSlot(document.body, 'toast-title')).not.toBeNull();
    expect(getSlot(document.body, 'toast-description')).toBeNull();
  });

  it('omits the action slot when no action is given', async () => {
    const manager = renderProvider();
    act(() => {
      manager.add({ title: 'No action' });
    });
    await screen.findByText('No action');
    expect(getSlot(document.body, 'toast-action')).toBeNull();
  });

  it('omits the leading icon slot when leadingIcon is null', async () => {
    const manager = renderProvider();
    act(() => {
      manager.add({ title: 'No icon', leadingIcon: null });
    });
    await screen.findByText('No icon');
    expect(getSlot(document.body, 'toast-leading-icon')).toBeNull();
  });
});
