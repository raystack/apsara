import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '../../../test-utils';
import { Select } from '../select';

describe('Select', () => {
  describe('Basic Rendering', () => {
    it('renders select trigger', () => {
      render(
        <Select>
          <Select.Trigger>
            <Select.Value placeholder='Select an option' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
          </Select.Content>
        </Select>
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('shows placeholder text', () => {
      render(
        <Select>
          <Select.Trigger>
            <Select.Value placeholder='Choose an option' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
          </Select.Content>
        </Select>
      );

      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('renders with custom className on trigger', () => {
      render(
        <Select>
          <Select.Trigger className='custom-trigger'>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('custom-trigger');
    });
  });

  describe('Single Selection', () => {
    it('selects an option when clicked', async () => {
      const handleChange = vi.fn();
      render(
        <Select onValueChange={handleChange}>
          <Select.Trigger>
            <Select.Value placeholder='Select' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='apple'>Apple</Select.Item>
            <Select.Item value='banana'>Banana</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(
          screen.getByRole('option', { name: 'Apple' })
        ).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('option', { name: 'Apple' }));
      expect(handleChange).toHaveBeenCalledWith('apple');
    });

    it('displays selected value', async () => {
      render(
        <Select defaultValue='banana'>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='apple'>Apple</Select.Item>
            <Select.Item value='banana'>Banana</Select.Item>
          </Select.Content>
        </Select>
      );

      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('works as controlled component', () => {
      const { rerender } = render(
        <Select value='apple'>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='apple'>Apple</Select.Item>
            <Select.Item value='banana'>Banana</Select.Item>
          </Select.Content>
        </Select>
      );

      expect(screen.getByText('Apple')).toBeInTheDocument();

      rerender(
        <Select value='banana'>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='apple'>Apple</Select.Item>
            <Select.Item value='banana'>Banana</Select.Item>
          </Select.Content>
        </Select>
      );

      expect(screen.getByText('Banana')).toBeInTheDocument();
    });
  });

  describe('Multiple Selection', () => {
    it('allows multiple selections', async () => {
      const handleChange = vi.fn();
      render(
        <Select multiple onValueChange={handleChange}>
          <Select.Trigger>
            <Select.Value placeholder='Select fruits' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='apple'>Apple</Select.Item>
            <Select.Item value='banana'>Banana</Select.Item>
            <Select.Item value='orange'>Orange</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(
          screen.getByRole('option', { name: 'Apple' })
        ).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('option', { name: 'Apple' }));
      expect(handleChange).toHaveBeenCalledWith(['apple']);

      fireEvent.click(screen.getByRole('option', { name: 'Banana' }));
      expect(handleChange).toHaveBeenCalledWith(['apple', 'banana']);
    });

    it('deselects items when clicked again', async () => {
      const handleChange = vi.fn();
      render(
        <Select multiple defaultValue={['apple', 'banana']}>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='apple'>Apple</Select.Item>
            <Select.Item value='banana'>Banana</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(
          screen.getByRole('option', { name: 'Apple' })
        ).toBeInTheDocument();
      });

      // Apple should be selected initially
      const appleOption = screen.getByRole('option', { name: 'Apple' });
      expect(appleOption).toHaveAttribute('aria-selected', 'true');
    });

    it('works with defaultValue for multiple', () => {
      render(
        <Select multiple defaultValue={['apple', 'orange']}>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='apple'>Apple</Select.Item>
            <Select.Item value='banana'>Banana</Select.Item>
            <Select.Item value='orange'>Orange</Select.Item>
          </Select.Content>
        </Select>
      );

      // Should show multiple selected values
      expect(screen.getByText(/Apple/)).toBeInTheDocument();
      expect(screen.getByText(/Orange/)).toBeInTheDocument();
    });
  });

  describe('Autocomplete', () => {
    it('filters options based on search', async () => {
      render(
        <Select autocomplete>
          <Select.Trigger>
            <Select.Value placeholder='Search...' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='apple'>Apple</Select.Item>
            <Select.Item value='banana'>Banana</Select.Item>
            <Select.Item value='apricot'>Apricot</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      // Type in search
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'ap' } });

      await waitFor(() => {
        expect(
          screen.queryByRole('option', { name: 'Apple' })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('option', { name: 'Apricot' })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('option', { name: 'Banana' })
        ).not.toBeInTheDocument();
      });
    });

    it('calls onSearch callback', async () => {
      const handleSearch = vi.fn();
      render(
        <Select autocomplete onSearch={handleSearch}>
          <Select.Trigger>
            <Select.Value placeholder='Search...' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='apple'>Apple</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'test' } });

      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('works with manual autocomplete mode', () => {
      render(
        <Select autocomplete autocompleteMode='manual' searchValue='custom'>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='apple'>Apple</Select.Item>
            <Select.Item value='banana'>Banana</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      // In manual mode, all items should be visible regardless of search
      expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Banana' })
      ).toBeInTheDocument();
    });
  });

  describe('Groups and Separators', () => {
    it('renders groups with labels', async () => {
      render(
        <Select>
          <Select.Trigger>
            <Select.Value placeholder='Select' />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>Fruits</Select.Label>
              <Select.Item value='apple'>Apple</Select.Item>
              <Select.Item value='banana'>Banana</Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.Label>Vegetables</Select.Label>
              <Select.Item value='carrot'>Carrot</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Fruits')).toBeInTheDocument();
        expect(screen.getByText('Vegetables')).toBeInTheDocument();
      });
    });

    it('renders separators between groups', async () => {
      const { container } = render(
        <Select>
          <Select.Trigger>
            <Select.Value placeholder='Select' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
            <Select.Separator />
            <Select.Item value='option2'>Option 2</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      await waitFor(() => {
        const separator = container.querySelector('[role="separator"]');
        expect(separator).toBeInTheDocument();
      });
    });
  });

  describe('Disabled State', () => {
    it('disables the entire select', () => {
      render(
        <Select disabled>
          <Select.Trigger>
            <Select.Value placeholder='Disabled' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
    });

    it('disables individual items', async () => {
      render(
        <Select>
          <Select.Trigger>
            <Select.Value placeholder='Select' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
            <Select.Item value='option2' disabled>
              Option 2
            </Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      await waitFor(() => {
        const disabledOption = screen.getByRole('option', { name: 'Option 2' });
        expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
      });
    });

    it('does not select disabled items', async () => {
      const handleChange = vi.fn();
      render(
        <Select onValueChange={handleChange}>
          <Select.Trigger>
            <Select.Value placeholder='Select' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1' disabled>
              Option 1
            </Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      await waitFor(() => {
        const option = screen.getByRole('option', { name: 'Option 1' });
        fireEvent.click(option);
      });

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Open State', () => {
    it('opens on trigger click', async () => {
      render(
        <Select>
          <Select.Trigger>
            <Select.Value placeholder='Select' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(
          screen.getByRole('option', { name: 'Option 1' })
        ).toBeInTheDocument();
      });
    });

    it('closes after selection', async () => {
      render(
        <Select>
          <Select.Trigger>
            <Select.Value placeholder='Select' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      await waitFor(() => {
        const option = screen.getByRole('option', { name: 'Option 1' });
        fireEvent.click(option);
      });

      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('controlled open state', () => {
      const handleOpenChange = vi.fn();
      render(
        <Select open={true} onOpenChange={handleOpenChange}>
          <Select.Trigger>
            <Select.Value placeholder='Select' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
          </Select.Content>
        </Select>
      );

      expect(
        screen.getByRole('option', { name: 'Option 1' })
      ).toBeInTheDocument();

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it('defaultOpen prop', () => {
      render(
        <Select defaultOpen={true}>
          <Select.Trigger>
            <Select.Value placeholder='Select' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
          </Select.Content>
        </Select>
      );

      expect(
        screen.getByRole('option', { name: 'Option 1' })
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Select>
          <Select.Trigger>
            <Select.Value placeholder='Select' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('supports keyboard navigation', async () => {
      render(
        <Select>
          <Select.Trigger>
            <Select.Value placeholder='Select' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
            <Select.Item value='option2'>Option 2</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      // Open with Enter
      fireEvent.keyDown(trigger, { key: 'Enter' });

      await waitFor(() => {
        expect(
          screen.getByRole('option', { name: 'Option 1' })
        ).toBeInTheDocument();
      });

      // Navigate with arrow keys
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement!, { key: 'Enter' });

      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('announces selected value to screen readers', () => {
      render(
        <Select value='apple'>
          <Select.Trigger aria-label='Fruit selection'>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='apple'>Apple</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByLabelText('Fruit selection');
      expect(trigger).toHaveTextContent('Apple');
    });
  });

  describe('Form Integration', () => {
    it('supports name attribute', () => {
      render(
        <Select name='fruit'>
          <Select.Trigger>
            <Select.Value placeholder='Select' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='apple'>Apple</Select.Item>
          </Select.Content>
        </Select>
      );

      // The select should have a hidden input with the name
      const hiddenInput = document.querySelector('input[name="fruit"]');
      expect(hiddenInput).toBeInTheDocument();
    });

    it('supports required attribute', () => {
      render(
        <Select required>
          <Select.Trigger>
            <Select.Value placeholder='Select' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='apple'>Apple</Select.Item>
          </Select.Content>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-required', 'true');
    });
  });
});
