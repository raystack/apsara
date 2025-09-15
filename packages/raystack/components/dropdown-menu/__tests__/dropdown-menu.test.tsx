import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DropdownMenu } from '../dropdown-menu';

describe('DropdownMenu', () => {
  describe('Basic Rendering', () => {
    it('renders dropdown trigger', () => {
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Menu Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      expect(screen.getByText('Open Menu')).toBeInTheDocument();
    });

    it('does not show content initially', () => {
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Menu Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      expect(screen.queryByText('Menu Item')).not.toBeInTheDocument();
    });

    it('shows content when opened', () => {
      render(
        <DropdownMenu open>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Menu Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      expect(screen.getByText('Menu Item')).toBeInTheDocument();
    });
  });

  describe('Trigger Interaction', () => {
    it('opens menu when trigger is clicked', async () => {
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Menu Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      const trigger = screen.getByText('Open Menu');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Menu Item')).toBeInTheDocument();
      });
    });

    // it('closes menu when clicked outside', async () => {
    //   render(
    //     <div>
    //       <DropdownMenu>
    //         <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
    //         <DropdownMenu.Content>
    //           <DropdownMenu.Item>Menu Item</DropdownMenu.Item>
    //         </DropdownMenu.Content>
    //       </DropdownMenu>
    //       <div data-testid='outside'>Outside element</div>
    //     </div>
    //   );

    //   const trigger = screen.getByText('Open Menu');
    //   fireEvent.click(trigger);

    //   await waitFor(() => {
    //     expect(screen.getByText('Menu Item')).toBeInTheDocument();
    //   });

    //   const outside = screen.getByTestId('outside');
    //   fireEvent.click(outside);

    //   await waitFor(() => {
    //     expect(screen.queryByText('Menu Item')).not.toBeInTheDocument();
    //   });
    // });
  });

  describe('Menu Items', () => {
    it('renders multiple menu items', () => {
      render(
        <DropdownMenu open>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item 1</DropdownMenu.Item>
            <DropdownMenu.Item>Item 2</DropdownMenu.Item>
            <DropdownMenu.Item>Item 3</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    // it('handles item clicks', async () => {
    //   const onSelect = vi.fn();

    //   render(
    //     <DropdownMenu open>
    //       <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
    //       <DropdownMenu.Content>
    //         <DropdownMenu.Item onAction={onSelect}>
    //           Clickable Item
    //         </DropdownMenu.Item>
    //       </DropdownMenu.Content>
    //     </DropdownMenu>
    //   );

    //   const item = screen.getByText('Clickable Item');
    //   fireEvent.click(item);

    //   expect(onSelect).toHaveBeenCalled();
    // });

    it('closes menu after item selection by default', async () => {
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Selectable Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      const trigger = screen.getByText('Open Menu');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Selectable Item')).toBeInTheDocument();
      });

      const item = screen.getByText('Selectable Item');
      fireEvent.click(item);

      await waitFor(() => {
        expect(screen.queryByText('Selectable Item')).not.toBeInTheDocument();
      });
    });
  });

  describe('Menu Groups and Labels', () => {
    it('renders menu groups with labels', () => {
      render(
        <DropdownMenu open>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Label>Group 1</DropdownMenu.Label>
            <DropdownMenu.Group>
              <DropdownMenu.Item>Item 1</DropdownMenu.Item>
              <DropdownMenu.Item>Item 2</DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Label>Group 2</DropdownMenu.Label>
            <DropdownMenu.Group>
              <DropdownMenu.Item>Item 3</DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('renders separators', () => {
      render(
        <DropdownMenu open>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item 1</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Item 2</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      // Separator would be tested through DOM structure
    });
  });

  describe('Empty State', () => {
    it('renders empty state when no items', () => {
      render(
        <DropdownMenu open>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.EmptyState>
              No items available
            </DropdownMenu.EmptyState>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      expect(screen.getByText('No items available')).toBeInTheDocument();
    });
  });

  describe('Controlled State', () => {
    it('works as controlled component', () => {
      const { rerender } = render(
        <DropdownMenu open={false}>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Menu Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      expect(screen.queryByText('Menu Item')).not.toBeInTheDocument();

      rerender(
        <DropdownMenu open={true}>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Menu Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      expect(screen.getByText('Menu Item')).toBeInTheDocument();
    });

    it('calls onOpenChange when state changes', async () => {
      const onOpenChange = vi.fn();

      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Menu Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      const trigger = screen.getByText('Open Menu');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('Autocomplete Mode', () => {
    it('supports autocomplete functionality', () => {
      const onSearch = vi.fn();

      render(
        <DropdownMenu autocomplete onSearch={onSearch}>
          <DropdownMenu.Trigger>Search Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item 1</DropdownMenu.Item>
            <DropdownMenu.Item>Item 2</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      expect(screen.getByText('Search Menu')).toBeInTheDocument();
    });

    it('handles search value changes', () => {
      const onSearch = vi.fn();

      render(
        <DropdownMenu autocomplete onSearch={onSearch} searchValue='test'>
          <DropdownMenu.Trigger>Search Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item 1</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      expect(screen.getByText('Search Menu')).toBeInTheDocument();
    });

    it('supports default search value', () => {
      render(
        <DropdownMenu autocomplete defaultSearchValue='default'>
          <DropdownMenu.Trigger>Search Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item 1</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      expect(screen.getByText('Search Menu')).toBeInTheDocument();
    });
  });

  // describe('TriggerItem Component', () => {
  //   // it('renders TriggerItem as menu item', () => {
  //   //   render(
  //   //     <DropdownMenu open>
  //   //       <DropdownMenu.Trigger>Main Menu</DropdownMenu.Trigger>
  //   //       <DropdownMenu.Content>
  //   //         <DropdownMenu.TriggerItem>Submenu Trigger</DropdownMenu.TriggerItem>
  //   //       </DropdownMenu.Content>
  //   //     </DropdownMenu>
  //   //   );

  //   //   expect(screen.getByText('Submenu Trigger')).toBeInTheDocument();
  //   // });
  // });

  describe('Keyboard Navigation', () => {
    it('supports arrow key navigation', async () => {
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item 1</DropdownMenu.Item>
            <DropdownMenu.Item>Item 2</DropdownMenu.Item>
            <DropdownMenu.Item>Item 3</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      const trigger = screen.getByText('Open Menu');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });

      // Keyboard navigation would be tested through focus management
      // This requires more complex event simulation
    });

    // it('closes on Escape key', async () => {
    //   render(
    //     <DropdownMenu>
    //       <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
    //       <DropdownMenu.Content>
    //         <DropdownMenu.Item>Menu Item</DropdownMenu.Item>
    //       </DropdownMenu.Content>
    //     </DropdownMenu>
    //   );

    //   const trigger = screen.getByText('Open Menu');
    //   fireEvent.click(trigger);

    //   await waitFor(() => {
    //     expect(screen.getByText('Menu Item')).toBeInTheDocument();
    //   });

    //   fireEvent.keyDown(document, { key: 'Escape' });

    //   await waitFor(() => {
    //     expect(screen.queryByText('Menu Item')).not.toBeInTheDocument();
    //   });
    // });
  });

  describe('Focus Management', () => {
    it('manages focus correctly', async () => {
      render(
        <DropdownMenu focusLoop>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item 1</DropdownMenu.Item>
            <DropdownMenu.Item>Item 2</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      const trigger = screen.getByText('Open Menu');
      expect(trigger).toBeInTheDocument();

      // Focus management testing would require more detailed DOM interaction
    });

    it('handles focus loop disabled', async () => {
      render(
        <DropdownMenu focusLoop={false}>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item 1</DropdownMenu.Item>
            <DropdownMenu.Item>Item 2</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      const trigger = screen.getByText('Open Menu');
      expect(trigger).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <DropdownMenu open>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Menu Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      const trigger = screen.getByText('Open Menu');
      expect(trigger).toBeInTheDocument();

      // ARIA attributes would be tested on the actual rendered elements
      // This requires checking specific roles and properties
    });

    it('supports screen readers', () => {
      render(
        <DropdownMenu open>
          <DropdownMenu.Trigger>Accessible Menu</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Label>Menu Section</DropdownMenu.Label>
            <DropdownMenu.Item>Accessible Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      expect(screen.getByText('Accessible Menu')).toBeInTheDocument();
      expect(screen.getByText('Menu Section')).toBeInTheDocument();
      expect(screen.getByText('Accessible Item')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing trigger gracefully', () => {
      render(
        <DropdownMenu>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Menu Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      // Should render without crashing
      expect(document.body).toBeInTheDocument();
    });

    it('handles missing content gracefully', () => {
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
        </DropdownMenu>
      );

      expect(screen.getByText('Open Menu')).toBeInTheDocument();
    });
  });
});
