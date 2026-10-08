import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from '../select';
import { SelectRootProps } from '../select-root';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

const flushMicrotasks = async () => await new Promise(r => setTimeout(r, 0));

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
    <Select items={FRUIT_OPTIONS} {...props}>
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

const openSelect = async (user: ReturnType<typeof userEvent.setup>) => {
  const trigger = screen.getByRole('combobox');
  await user.click(trigger);
  await screen.findByRole('listbox');
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
      const user = userEvent.setup();
      await openSelect(user);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      FRUIT_OPTIONS.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });
  });

  describe('Portal', () => {
    it('renders the popup outside the select container', async () => {
      const user = userEvent.setup();
      render(
        <div data-testid='wrapper'>
          <BasicSelect />
        </div>
      );
      await openSelect(user);

      const listbox = screen.getByRole('listbox');
      expect(screen.getByTestId('wrapper')).not.toContainElement(listbox);
      expect(document.body).toContainElement(listbox);
    });
  });

  describe('Value', () => {
    it('shows the label from items before the popup opens', async () => {
      render(<BasicSelect defaultValue='blueberry' />);
      await flushMicrotasks();

      expect(screen.getByRole('combobox')).toHaveTextContent('Blueberry');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('accepts items as a value-to-label record', async () => {
      render(
        <BasicSelect
          items={{ apple: 'Red apple', banana: 'Banana' }}
          defaultValue='apple'
        />
      );
      await flushMicrotasks();

      expect(screen.getByRole('combobox')).toHaveTextContent('Red apple');
    });

    it('shows the raw value when items are not given', async () => {
      render(<BasicSelect items={undefined} defaultValue='apple' />);
      await flushMicrotasks();

      expect(screen.getByRole('combobox')).toHaveTextContent('apple');
    });

    it('shows the placeholder when nothing is selected', async () => {
      render(<BasicSelect />);
      await flushMicrotasks();

      const value = screen.getByText(TRIGGER_TEXT);
      expect(value).toHaveAttribute('data-placeholder');
    });

    it('passes the selected value to a function child', async () => {
      render(
        <Select items={FRUIT_OPTIONS} defaultValue='banana'>
          <Select.Trigger>
            <Select.Value placeholder={TRIGGER_TEXT}>
              {value => <span data-testid='custom'>icon-{value}</span>}
            </Select.Value>
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='banana'>Banana</Select.Item>
          </Select.Content>
        </Select>
      );
      await flushMicrotasks();

      expect(screen.getByTestId('custom')).toHaveTextContent('icon-banana');
    });

    it('shows chips with labels in multiple mode', async () => {
      const { container } = render(
        <BasicSelect multiple defaultValue={['grapes']} />
      );
      await flushMicrotasks();

      const value = container.querySelector(
        '[data-slot="select-value-content"]'
      );
      expect(value).toHaveTextContent('Grapes');
    });

    it('shows the label in autocomplete mode before the popup opens', async () => {
      render(<BasicSelect autocomplete defaultValue='pineapple' />);
      await flushMicrotasks();

      expect(screen.getByLabelText('Select option')).toHaveTextContent(
        'Pineapple'
      );
    });
  });

  describe('Label', () => {
    it('labels the trigger', async () => {
      render(
        <Select items={FRUIT_OPTIONS}>
          <Select.Label>Fruit</Select.Label>
          <Select.Trigger aria-label={undefined}>
            <Select.Value placeholder={TRIGGER_TEXT} />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='apple'>Apple</Select.Item>
          </Select.Content>
        </Select>
      );
      await flushMicrotasks();

      const label = screen.getByText('Fruit');
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-labelledby',
        expect.stringContaining(label.id)
      );
    });
  });

  describe('Single Selection', () => {
    it('marks only the selected item with an indicator', async () => {
      const user = userEvent.setup();
      render(<BasicSelect defaultValue='banana' />);
      await flushMicrotasks();
      await openSelect(user);
      await flushMicrotasks();

      const options = screen.getAllByRole('option');
      expect(
        options[1].querySelector('[data-slot="select-item-indicator"]')
      ).not.toBeNull();
      expect(
        options[0].querySelector('[data-slot="select-item-indicator"]')
      ).toBeNull();
      expect(within(options[1]).queryByRole('checkbox')).toBeNull();
    });

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
      const user = userEvent.setup();
      await openSelect(user);

      const options = screen.getAllByRole('option');
      await user.click(options[1]);
      await flushMicrotasks();

      expect(handleValueChange).toHaveBeenCalledWith('banana');
      expect(handleValueChange).toHaveBeenCalledTimes(1);
    });

    it('closes content after selection', async () => {
      render(<BasicSelect />);
      const user = userEvent.setup();
      await openSelect(user);

      expect(screen.getByRole('listbox')).toBeInTheDocument();

      const options = screen.getAllByRole('option');
      await user.click(options[1]);
      await flushMicrotasks();

      // Base UI keeps the popup in the DOM and toggles visibility.
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Selection', () => {
    it('supports multiple selection', async () => {
      const handleValueChange = vi.fn();
      render(<BasicSelect multiple onValueChange={handleValueChange} />);
      const user = userEvent.setup();
      await openSelect(user);

      const options = screen.getAllByRole('option');

      await user.click(options[1]);
      await flushMicrotasks();
      expect(handleValueChange).toHaveBeenCalledWith(['banana']);

      await user.click(options[4]);
      await flushMicrotasks();
      expect(handleValueChange).toHaveBeenCalledWith(['banana', 'pineapple']);

      const optionsAfterSelection = screen.getAllByRole('option');
      expect(optionsAfterSelection[1]).toHaveAttribute('aria-selected', 'true');
      expect(optionsAfterSelection[4]).toHaveAttribute('aria-selected', 'true');
    });

    it('allows deselecting items in multiple mode', async () => {
      const handleValueChange = vi.fn();
      render(<BasicSelect multiple onValueChange={handleValueChange} />);
      const user = userEvent.setup();
      await openSelect(user);

      const options = screen.getAllByRole('option');

      await user.click(options[1]);
      await flushMicrotasks();
      expect(handleValueChange).toHaveBeenCalledWith(['banana']);

      await user.click(options[1]);
      await flushMicrotasks();
      expect(handleValueChange).toHaveBeenCalledWith([]);
    });

    it('renders a checkbox indicator that reflects selection state', async () => {
      const user = userEvent.setup();
      render(<BasicSelect multiple />);
      await openSelect(user);

      const options = screen.getAllByRole('option');
      // One checkbox per item (the hidden native input is aria-hidden).
      expect(within(options[1]).getAllByRole('checkbox')).toHaveLength(1);

      const checkbox = within(options[1]).getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');

      await user.click(options[1]);
      await flushMicrotasks();
      expect(
        within(screen.getAllByRole('option')[1]).getByRole('checkbox')
      ).toHaveAttribute('aria-checked', 'true');
    });

    it('fires onValueChange exactly once per click on an option', async () => {
      const handleValueChange = vi.fn();
      render(<BasicSelect multiple onValueChange={handleValueChange} />);
      const user = userEvent.setup();
      await openSelect(user);

      await user.click(screen.getAllByRole('option')[1]);
      await flushMicrotasks();
      expect(handleValueChange).toHaveBeenCalledTimes(1);
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
      await openSelect(user);

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('selects option with Enter key', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <BasicSelect defaultValue='apple' onValueChange={handleValueChange} />
      );
      await openSelect(user);

      const options = screen.getAllByRole('option');
      options[1].focus();
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
      await openSelect(user);

      // Ensure keyboard events target the listbox.
      const options = screen.getAllByRole('option');
      options[0]?.focus();
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

    it('marks the selected item with an indicator', async () => {
      render(<BasicSelect autocomplete defaultValue='banana' />);

      fireEvent.click(screen.getByLabelText('Select option'));
      await flushMicrotasks();

      const options = screen.getAllByRole('option');
      expect(
        options[1].querySelector('[data-slot="select-item-indicator"]')
      ).not.toBeNull();
      expect(
        options[0].querySelector('[data-slot="select-item-indicator"]')
      ).toBeNull();
    });

    it('filters options by label when items are given', async () => {
      const user = userEvent.setup();
      render(
        <Select
          autocomplete
          items={[
            { value: 'a', label: 'Apple' },
            { value: 'b', label: 'Banana' }
          ]}
        >
          <Select.Trigger>
            <Select.Value placeholder={TRIGGER_TEXT} />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='a'>Apple</Select.Item>
            <Select.Item value='b'>Banana</Select.Item>
          </Select.Content>
        </Select>
      );

      fireEvent.click(screen.getByLabelText('Select option'));
      await flushMicrotasks();
      await user.type(screen.getByPlaceholderText('Search...'), 'ban');
      await flushMicrotasks();

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('Banana');
    });

    it('shows Select.Empty only when no item matches', async () => {
      const user = userEvent.setup();
      render(
        <Select autocomplete items={FRUIT_OPTIONS}>
          <Select.Trigger>
            <Select.Value placeholder={TRIGGER_TEXT} />
          </Select.Trigger>
          <Select.Content>
            <Select.Empty>No fruit found</Select.Empty>
            {FRUIT_OPTIONS.map(option => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      );

      fireEvent.click(screen.getByLabelText('Select option'));
      await flushMicrotasks();
      expect(screen.queryByText('No fruit found')).not.toBeInTheDocument();

      await user.type(screen.getByPlaceholderText('Search...'), 'zzz');
      await flushMicrotasks();
      expect(screen.getByText('No fruit found')).toBeInTheDocument();
      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    it('renders Select.Status as a live region', async () => {
      render(
        <Select autocomplete items={FRUIT_OPTIONS}>
          <Select.Trigger>
            <Select.Value placeholder={TRIGGER_TEXT} />
          </Select.Trigger>
          <Select.Content>
            <Select.Status>5 fruits</Select.Status>
            <Select.Item value='apple'>Apple</Select.Item>
          </Select.Content>
        </Select>
      );

      fireEvent.click(screen.getByLabelText('Select option'));
      await flushMicrotasks();

      const status = document.querySelector<HTMLElement>(
        '[data-slot="select-status"]'
      );
      expect(status).toHaveTextContent('5 fruits');
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(screen.getByRole('listbox')).not.toContainElement(status);
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
