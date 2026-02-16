import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from '../select';
import { SelectRootProps } from '../select-root';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

// Flush pending microtasks (same pattern as Base UI's own tests)
const flushMicrotasks = async () => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
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

const renderAndOpenSelect = async (element: React.ReactElement) => {
  const user = userEvent.setup();
  const result = render(element);
  const trigger = result.getByRole('combobox');
  fireEvent.click(trigger);
  await flushMicrotasks();
  return { ...result, user };
};

describe('Select', () => {
  describe('Basic Rendering', () => {
    it('renders select trigger', () => {
      render(<BasicSelect />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
      expect(within(trigger).getByText(TRIGGER_TEXT)).toBeInTheDocument();
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
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('shows content when trigger is clicked', async () => {
      await renderAndOpenSelect(<BasicSelect />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      FRUIT_OPTIONS.forEach(option => {
        expect(
          screen.getByRole('option', { name: option.label })
        ).toBeInTheDocument();
      });
    });

    it('renders options list', async () => {
      await renderAndOpenSelect(<BasicSelect />);

      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });
  });

  describe('Single Selection', () => {
    it('displays selected value', () => {
      render(<BasicSelect defaultValue='apple' />);
      const trigger = screen.getByRole('combobox');
      expect(within(trigger).getByText('Apple')).toBeInTheDocument();
    });

    it('works as controlled component', () => {
      const handleValueChange = vi.fn();
      render(<BasicSelect value='apple' onValueChange={handleValueChange} />);
      const trigger = screen.getByRole('combobox');
      expect(within(trigger).getByText('Apple')).toBeInTheDocument();
    });

    it('selects option when clicked', async () => {
      const handleValueChange = vi.fn();
      const { user } = await renderAndOpenSelect(
        <BasicSelect defaultValue='apple' onValueChange={handleValueChange} />
      );

      const option = screen.getByRole('option', { name: 'Banana' });
      await user.click(option);
      await flushMicrotasks();

      expect(handleValueChange).toHaveBeenCalledWith('banana');
    });

    it('closes content after selection', async () => {
      const { user } = await renderAndOpenSelect(<BasicSelect />);

      const option = screen.getByRole('option', { name: 'Banana' });
      await user.click(option);
      await flushMicrotasks();

      const trigger = screen.getByRole('combobox');
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('Multiple Selection', () => {
    it('supports multiple selection', async () => {
      const handleValueChange = vi.fn();
      const { user } = await renderAndOpenSelect(
        <BasicSelect multiple onValueChange={handleValueChange} />
      );

      await user.click(screen.getByRole('option', { name: 'Banana' }));
      await flushMicrotasks();
      expect(handleValueChange).toHaveBeenCalledWith(['banana']);

      await user.click(screen.getByRole('option', { name: 'Pineapple' }));
      await flushMicrotasks();
      expect(handleValueChange).toHaveBeenCalledWith(['banana', 'pineapple']);
    });

    it('allows deselecting items in multiple mode', async () => {
      const handleValueChange = vi.fn();
      const { user } = await renderAndOpenSelect(
        <BasicSelect multiple onValueChange={handleValueChange} />
      );

      const banana = screen.getByRole('option', { name: 'Banana' });
      await user.click(banana);
      await flushMicrotasks();
      expect(handleValueChange).toHaveBeenCalledWith(['banana']);

      await user.click(banana);
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

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('opens with Space key', async () => {
      const user = userEvent.setup();
      render(<BasicSelect />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();
      await user.keyboard(' ');

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('closes with Escape key', async () => {
      const user = userEvent.setup();
      render(<BasicSelect />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });

      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('selects option with keyboard', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(<BasicSelect onValueChange={handleValueChange} />);

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);
      await flushMicrotasks();

      // Focus the highlighted item so keyboard events reach the list
      const firstOption = screen.getByRole('option', { name: 'Apple' });
      await act(async () => firstOption.focus());

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(handleValueChange).toHaveBeenCalled();
      });
    });
  });

  describe('Autocomplete Mode', () => {
    it('renders search input in autocomplete mode', async () => {
      await renderAndOpenSelect(<BasicSelect autocomplete />);

      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput).toBeInTheDocument();
    });

    it('filters options based on search', async () => {
      await renderAndOpenSelect(<BasicSelect autocomplete />);

      const searchInput = screen.getByPlaceholderText('Search...');
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: 'app' } });
      });

      const options = screen.getAllByRole('option');
      expect(options.length).toBe(2);
      expect(options[0].textContent).toBe('Apple');
      expect(options[1].textContent).toBe('Pineapple');
    });
  });
});
