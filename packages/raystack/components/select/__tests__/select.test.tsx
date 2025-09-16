import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from '../select';
import { SelectRootProps } from '../select-root';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

const TRIGGER_TEXT = 'Select a fruit';
const FRUIT_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes' },
  { value: 'pineapple', label: 'Pineapple' }
];

const BasicSelect = ({ ...props }: SelectRootProps) => {
  return (
    <Select {...props}>
      <Select.Trigger>
        <Select.Value placeholder={TRIGGER_TEXT} />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          {FRUIT_OPTIONS.map(option => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select>
  );
};
const renderAndOpenSelect = async (Select: any) => {
  await fireEvent.click(render(Select).getByRole('combobox'));
};

describe('Select', () => {
  describe('Basic Rendering', () => {
    it('renders select trigger', () => {
      render(<BasicSelect />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
      expect(screen.getByText(TRIGGER_TEXT)).toBeInTheDocument();
    });

    it('renders with custom className on trigger', () => {
      render(
        <Select>
          <Select.Trigger className='custom-trigger'>
            <Select.Value placeholder='Select' />
          </Select.Trigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('does not show content initially', () => {
      render(<BasicSelect />);
      FRUIT_OPTIONS.forEach(option => {
        expect(screen.queryByText(option.label)).not.toBeInTheDocument();
      });
    });

    it('shows content when trigger is clicked', async () => {
      await renderAndOpenSelect(<BasicSelect />);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      FRUIT_OPTIONS.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('renders in portal', async () => {
      await renderAndOpenSelect(<BasicSelect />);

      const content = screen.getByRole('listbox');
      expect(content.closest('body')).toBe(document.body);
    });
  });

  describe('Single Selection', () => {
    it('displays selected value', () => {
      render(<BasicSelect defaultValue='apple' />);
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('works as controlled component', () => {
      const handleValueChange = vi.fn();
      render(<BasicSelect value='apple' onValueChange={handleValueChange} />);
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('selects option when clicked', async () => {
      const handleValueChange = vi.fn();
      renderAndOpenSelect(
        <BasicSelect defaultValue='apple' onValueChange={handleValueChange} />
      );

      const options = await screen.findAllByRole('option');
      fireEvent.click(options[1]);

      expect(handleValueChange).toHaveBeenCalledWith('banana');
      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('closes content after selection', async () => {
      renderAndOpenSelect(<BasicSelect />);

      expect(screen.getByRole('listbox')).toBeInTheDocument();

      const options = await screen.findAllByRole('option');
      fireEvent.click(options[1]);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Selection', () => {
    it('supports multiple selection', async () => {
      const handleValueChange = vi.fn();
      renderAndOpenSelect(
        <BasicSelect multiple onValueChange={handleValueChange} />
      );
      const options = await screen.findAllByRole('option');

      fireEvent.click(options[1]);
      expect(handleValueChange).toHaveBeenCalledWith(['banana']);

      fireEvent.click(options[4]);
      expect(handleValueChange).toHaveBeenCalledWith(['banana', 'pineapple']);

      expect(options[1]).toHaveAttribute('aria-selected', 'true');
      expect(options[4]).toHaveAttribute('aria-selected', 'true');
    });

    it('allows deselecting items in multiple mode', async () => {
      const handleValueChange = vi.fn();
      renderAndOpenSelect(
        <BasicSelect multiple onValueChange={handleValueChange} />
      );
      const options = await screen.findAllByRole('option');

      fireEvent.click(options[1]);
      expect(handleValueChange).toHaveBeenCalledWith(['banana']);

      fireEvent.click(options[1]);
      expect(handleValueChange).toHaveBeenCalledWith([]);
    });
  });

  describe('Keyboard Navigation', () => {
    it('opens with Enter key', async () => {
      const user = userEvent.setup();
      render(<BasicSelect />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('opens with Space key', async () => {
      const user = userEvent.setup();
      render(<BasicSelect />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();
      await user.keyboard(' ');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('closes with Escape key', async () => {
      const user = userEvent.setup();
      renderAndOpenSelect(<BasicSelect />);

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('selects option with Enter key', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      renderAndOpenSelect(
        <BasicSelect defaultValue='apple' onValueChange={handleValueChange} />
      );

      const options = await screen.findAllByRole('option');
      options[1].focus();
      await user.keyboard('{Enter}');

      expect(handleValueChange).toHaveBeenCalledWith('banana');
      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('navigates options with arrow keys', async () => {
      const user = userEvent.setup();
      renderAndOpenSelect(<BasicSelect defaultValue='apple' />);

      await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

      expect(screen.getByText('Blueberry')).toBeInTheDocument();
    });
  });

  describe('Autocomplete Mode', () => {
    it('renders search input in autocomplete mode', async () => {
      renderAndOpenSelect(<BasicSelect autocomplete />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'placeholder',
        'Search...'
      );
    });
  });

  it('filters options based on search', async () => {
    const user = userEvent.setup();
    renderAndOpenSelect(<BasicSelect autocomplete />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'app');

    const options = await screen.findAllByRole('option');
    expect(options.length).toBe(2);
    expect(options[0].textContent).toBe('Apple');
    expect(options[1].textContent).toBe('Pineapple');
  });
  //     const user = userEvent.setup();
  //     render(<BasicSelect autocomplete />);

  //     const trigger = screen.getByRole('combobox');
  //     await user.click(trigger);

  //     await waitFor(() => {
  //       expect(screen.getByRole('dialog')).toBeInTheDocument();
  //     });

  //     const searchInput = screen.getByPlaceholderText('Search...');
  //     await user.type(searchInput, 'app');
  //     await user.clear(searchInput);

  //     await waitFor(() => {
  //       FRUIT_OPTIONS.forEach(option => {
  //         expect(screen.getByText(option.label)).toBeInTheDocument();
  //       });
  //     });
  //   });
  // });

  // describe('Grouping and Labels', () => {
  //   it('renders grouped options', async () => {
  //     const user = userEvent.setup();
  //     render(
  //       <Select>
  //         <Select.Trigger>
  //           <Select.Value placeholder='Select' />
  //         </Select.Trigger>
  //         <Select.Content>
  //           <Select.Group>
  //             <Select.Label>Fruits</Select.Label>
  //             <Select.Item value='apple'>Apple</Select.Item>
  //             <Select.Item value='banana'>Banana</Select.Item>
  //           </Select.Group>
  //           <Select.Separator />
  //           <Select.Group>
  //             <Select.Label>Vegetables</Select.Label>
  //             <Select.Item value='carrot'>Carrot</Select.Item>
  //             <Select.Item value='broccoli'>Broccoli</Select.Item>
  //           </Select.Group>
  //         </Select.Content>
  //       </Select>
  //     );

  //     const trigger = screen.getByRole('combobox');
  //     await user.click(trigger);

  //     await waitFor(() => {
  //       expect(screen.getByText('Fruits')).toBeInTheDocument();
  //       expect(screen.getByText('Vegetables')).toBeInTheDocument();
  //       expect(screen.getByText('Apple')).toBeInTheDocument();
  //       expect(screen.getByText('Carrot')).toBeInTheDocument();
  //     });
  //   });
  // });

  // describe('Controlled Mode', () => {
  //   it('works as controlled component', () => {
  //     const { rerender } = render(
  //       <Select open={false}>
  //         <Select.Trigger>
  //           <Select.Value placeholder='Select' />
  //         </Select.Trigger>
  //         <Select.Content>
  //           <Select.Item value='option1'>Option 1</Select.Item>
  //         </Select.Content>
  //       </Select>
  //     );

  //     expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

  //     rerender(
  //       <Select open={true}>
  //         <Select.Trigger>
  //           <Select.Value placeholder='Select' />
  //         </Select.Trigger>
  //         <Select.Content>
  //           <Select.Item value='option1'>Option 1</Select.Item>
  //         </Select.Content>
  //       </Select>
  //     );

  //     expect(screen.getByRole('listbox')).toBeInTheDocument();
  //   });

  //   it('calls onOpenChange when state changes', async () => {
  //     const user = userEvent.setup();
  //     const onOpenChange = vi.fn();
  //     render(<BasicSelect open={false} onOpenChange={onOpenChange} />);

  //     const trigger = screen.getByRole('combobox');
  //     await user.click(trigger);

  //     expect(onOpenChange).toHaveBeenCalledWith(true);
  //   });
  // });

  // describe('Accessibility', () => {
  //   it('has correct ARIA roles', async () => {
  //     const user = userEvent.setup();
  //     render(<BasicSelect />);

  //     const trigger = screen.getByRole('combobox');
  //     await user.click(trigger);

  //     await waitFor(() => {
  //       const listbox = screen.getByRole('listbox');
  //       expect(listbox).toBeInTheDocument();
  //       expect(listbox).toHaveAttribute('aria-multiselectable', 'false');
  //     });
  //   });

  //   it('has correct ARIA roles for multiple selection', async () => {
  //     const user = userEvent.setup();
  //     render(<BasicSelect multiple />);

  //     const trigger = screen.getByRole('combobox');
  //     await user.click(trigger);

  //     await waitFor(() => {
  //       const listbox = screen.getByRole('listbox');
  //       expect(listbox).toBeInTheDocument();
  //       expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
  //     });
  //   });

  //   it('has correct ARIA roles for autocomplete', async () => {
  //     const user = userEvent.setup();
  //     render(<BasicSelect autocomplete />);

  //     const trigger = screen.getByRole('combobox');
  //     await user.click(trigger);

  //     await waitFor(() => {
  //       const dialog = screen.getByRole('dialog');
  //       expect(dialog).toBeInTheDocument();
  //     });
  //   });

  //   it('uses custom ARIA label when provided', () => {
  //     render(
  //       <Select>
  //         <Select.Trigger aria-label='Custom select label'>
  //           <Select.Value placeholder='Select' />
  //         </Select.Trigger>
  //         <Select.Content>
  //           <Select.Item value='option1'>Option 1</Select.Item>
  //         </Select.Content>
  //       </Select>
  //     );

  //     const trigger = screen.getByRole('combobox');
  //     expect(trigger).toHaveAttribute('aria-label', 'Custom select label');
  //   });

  //   it('marks selected items correctly', async () => {
  //     const user = userEvent.setup();
  //     render(<BasicSelect defaultValue='apple' />);

  //     const trigger = screen.getByRole('combobox');
  //     await user.click(trigger);

  //     await waitFor(() => {
  //       const appleOption = screen.getByText('Apple');
  //       expect(appleOption).toHaveAttribute('aria-selected', 'true');
  //       expect(appleOption).toHaveAttribute('data-checked', 'true');
  //     });
  //   });
  // });

  // describe('Disabled State', () => {
  //   it('disables individual items', async () => {
  //     const user = userEvent.setup();
  //     render(
  //       <Select>
  //         <Select.Trigger>
  //           <Select.Value placeholder='Select' />
  //         </Select.Trigger>
  //         <Select.Content>
  //           <Select.Item value='apple'>Apple</Select.Item>
  //           <Select.Item value='banana' disabled>
  //             Banana
  //           </Select.Item>
  //         </Select.Content>
  //       </Select>
  //     );

  //     const trigger = screen.getByRole('combobox');
  //     await user.click(trigger);

  //     await waitFor(() => {
  //       const bananaOption = screen.getByText('Banana');
  //       expect(bananaOption).toHaveAttribute('disabled');
  //     });
  //   });

  //   it('prevents selection of disabled items', async () => {
  //     const user = userEvent.setup();
  //     const handleValueChange = vi.fn();
  //     render(
  //       <Select onValueChange={handleValueChange}>
  //         <Select.Trigger>
  //           <Select.Value placeholder='Select' />
  //         </Select.Trigger>
  //         <Select.Content>
  //           <Select.Item value='apple'>Apple</Select.Item>
  //           <Select.Item value='banana' disabled>
  //             Banana
  //           </Select.Item>
  //         </Select.Content>
  //       </Select>
  //     );

  //     const trigger = screen.getByRole('combobox');
  //     await user.click(trigger);

  //     await waitFor(() => {
  //       expect(screen.getByRole('listbox')).toBeInTheDocument();
  //     });

  //     const bananaOption = screen.getByText('Banana');
  //     await user.click(bananaOption);

  //     expect(handleValueChange).not.toHaveBeenCalled();
  //   });
  // });
});
