import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from '../select';
import { SelectRootProps } from '../select-root';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

const flushMicrotasks = async () => {
  await act(async () => {
    await new Promise(r => setTimeout(r, 0));
  });
};

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

const openSelect = async () => {
  const trigger = screen.getByRole('combobox');
  fireEvent.click(trigger);
  await flushMicrotasks();
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

    it('shows content when trigger is clicked', async () => {
      render(<BasicSelect />);
      await openSelect();

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      FRUIT_OPTIONS.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });
  });

  describe('Single Selection', () => {
    it('displays selected value in trigger', async () => {
      render(<BasicSelect defaultValue='apple' />);
      await flushMicrotasks();

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveTextContent('Apple');
    });

    it('works as controlled component', async () => {
      const handleValueChange = vi.fn();
      render(<BasicSelect value='apple' onValueChange={handleValueChange} />);
      await flushMicrotasks();

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveTextContent('Apple');
    });

    it('selects option when clicked', async () => {
      const handleValueChange = vi.fn();
      render(
        <BasicSelect defaultValue='apple' onValueChange={handleValueChange} />
      );
      await openSelect();

      const options = screen.getAllByRole('option');
      await act(async () => {
        await userEvent.click(options[1]);
      });
      await flushMicrotasks();

      expect(handleValueChange).toHaveBeenCalledWith('banana');
      expect(handleValueChange).toHaveBeenCalledTimes(1);
    });

    it('closes content after selection', async () => {
      render(<BasicSelect />);
      await openSelect();

      expect(screen.getByRole('listbox')).toBeInTheDocument();

      const options = screen.getAllByRole('option');
      await act(async () => {
        await userEvent.click(options[1]);
      });
      await flushMicrotasks();

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Selection', () => {
    it('supports multiple selection', async () => {
      const handleValueChange = vi.fn();
      render(<BasicSelect multiple onValueChange={handleValueChange} />);
      await openSelect();

      const options = screen.getAllByRole('option');

      await act(async () => {
        await userEvent.click(options[1]);
      });
      await flushMicrotasks();
      expect(handleValueChange).toHaveBeenCalledWith(['banana']);

      await act(async () => {
        await userEvent.click(options[4]);
      });
      await flushMicrotasks();
      expect(handleValueChange).toHaveBeenCalledWith(['banana', 'pineapple']);

      expect(options[1]).toHaveAttribute('aria-selected', 'true');
      expect(options[4]).toHaveAttribute('aria-selected', 'true');
    });

    it('allows deselecting items in multiple mode', async () => {
      const handleValueChange = vi.fn();
      render(<BasicSelect multiple onValueChange={handleValueChange} />);
      await openSelect();

      const options = screen.getAllByRole('option');

      await act(async () => {
        await userEvent.click(options[1]);
      });
      await flushMicrotasks();
      expect(handleValueChange).toHaveBeenCalledWith(['banana']);

      await act(async () => {
        await userEvent.click(options[1]);
      });
      await flushMicrotasks();
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
      render(<BasicSelect />);
      await openSelect();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('selects option with Enter key', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <BasicSelect defaultValue='apple' onValueChange={handleValueChange} />
      );
      await openSelect();

      const options = screen.getAllByRole('option');
      await act(() => options[1].focus());
      await user.keyboard('{Enter}');
      await flushMicrotasks();

      expect(handleValueChange).toHaveBeenCalledWith('banana');
      expect(handleValueChange).toHaveBeenCalledTimes(1);
    });

    it('navigates options with arrow keys', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <BasicSelect defaultValue='apple' onValueChange={handleValueChange} />
      );
      await openSelect();

      await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
      await flushMicrotasks();

      expect(handleValueChange).toHaveBeenCalledWith('blueberry');
    });
  });

  describe('Autocomplete Mode', () => {
    it('renders search input in autocomplete mode', async () => {
      render(<BasicSelect autocomplete />);

      const trigger = screen.getByLabelText('Select option');
      fireEvent.click(trigger);
      await flushMicrotasks();

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput).toBeInTheDocument();
    });

    it('filters options based on search', async () => {
      const user = userEvent.setup();
      render(<BasicSelect autocomplete />);

      const trigger = screen.getByLabelText('Select option');
      fireEvent.click(trigger);
      await flushMicrotasks();

      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'app');
      await flushMicrotasks();

      const options = screen.getAllByRole('option');
      expect(options.length).toBe(2);
      expect(options[0]).toHaveTextContent('Apple');
      expect(options[1]).toHaveTextContent('Pineapple');
    });
  });
});
