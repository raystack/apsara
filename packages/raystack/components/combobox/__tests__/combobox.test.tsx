import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Combobox } from '../combobox';
import { ComboboxRootProps } from '../combobox-root';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

const PLACEHOLDER_TEXT = 'Enter a fruit';
const FRUIT_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes' },
  { value: 'pineapple', label: 'Pineapple' }
];

const BasicCombobox = (props: ComboboxRootProps) => {
  return (
    <Combobox {...props}>
      <Combobox.Input placeholder={PLACEHOLDER_TEXT} />
      <Combobox.Content>
        {FRUIT_OPTIONS.map(option => (
          <Combobox.Item key={option.value} value={option.value}>
            {option.label}
          </Combobox.Item>
        ))}
      </Combobox.Content>
    </Combobox>
  );
};

const clickOption = async (element: HTMLElement) => {
  const option = element.closest('[role="option"]') ?? element;
  fireEvent.pointerDown(option);
  fireEvent.click(option);
};

describe('Combobox', () => {
  describe('Basic Rendering', () => {
    it('renders combobox input', () => {
      render(<BasicCombobox />);
      const input = screen.getByRole('combobox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', PLACEHOLDER_TEXT);
    });

    it('does not show content initially', () => {
      render(<BasicCombobox />);
      FRUIT_OPTIONS.forEach(option => {
        expect(screen.queryByText(option.label)).not.toBeInTheDocument();
      });
    });

    it('shows content when input is clicked', async () => {
      const user = userEvent.setup();
      render(<BasicCombobox />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      FRUIT_OPTIONS.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('renders in portal', async () => {
      const user = userEvent.setup();
      render(<BasicCombobox />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        const content = screen.getByRole('listbox');
        expect(content.closest('body')).toBe(document.body);
      });
    });
  });

  describe('Single Selection', () => {
    it('selects option when clicked', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(<BasicCombobox onValueChange={handleValueChange} />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      const bananaOption = await screen.findByText('Banana');
      await clickOption(bananaOption);

      expect(handleValueChange).toHaveBeenCalledWith('banana');
    });

    it('closes content after selection in single mode', async () => {
      const user = userEvent.setup();
      render(<BasicCombobox />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const bananaOption = await screen.findByText('Banana');
      await clickOption(bananaOption);

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('updates input value with selected item', async () => {
      const user = userEvent.setup();
      render(<BasicCombobox />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      const appleOption = await screen.findByText('Apple');
      await clickOption(appleOption);

      expect(input).toHaveValue('apple');
    });
  });

  describe('Multiple Selection', () => {
    it('supports multiple selection', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(<BasicCombobox multiple onValueChange={handleValueChange} />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      const bananaOption = await screen.findByText('Banana');
      await clickOption(bananaOption);
      expect(handleValueChange).toHaveBeenCalledWith(['banana']);

      const pineappleOption = await screen.findByText('Pineapple');
      await clickOption(pineappleOption);
      expect(handleValueChange).toHaveBeenCalledWith(['banana', 'pineapple']);
    });

    it('allows deselecting items in multiple mode', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(<BasicCombobox multiple onValueChange={handleValueChange} />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      const bananaOption = await screen.findByText('Banana');
      await clickOption(bananaOption);
      expect(handleValueChange).toHaveBeenCalledWith(['banana']);

      await clickOption(bananaOption);
      expect(handleValueChange).toHaveBeenCalledWith([]);
    });

    it('keeps dropdown open after selection in multiple mode', async () => {
      const user = userEvent.setup();
      render(<BasicCombobox multiple />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const bananaOption = await screen.findByText('Banana');
      await clickOption(bananaOption);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('opens with typing', async () => {
      const user = userEvent.setup();
      render(<BasicCombobox />);

      const input = screen.getByRole('combobox');
      await user.type(input, 'a');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('closes with Escape key', async () => {
      const user = userEvent.setup();
      render(<BasicCombobox />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('Search/Filter', () => {
    it('filters options based on input', async () => {
      const user = userEvent.setup();
      render(<BasicCombobox />);

      const input = screen.getByRole('combobox');
      await user.type(input, 'app');

      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options.length).toBe(2);
        expect(options[0].textContent).toBe('Apple');
        expect(options[1].textContent).toBe('Pineapple');
      });
    });

    it('shows all options when search is cleared', async () => {
      const user = userEvent.setup();
      render(<BasicCombobox />);

      const input = screen.getByRole('combobox');
      await user.type(input, 'app');

      await waitFor(() => {
        expect(screen.getAllByRole('option').length).toBe(2);
      });

      await user.clear(input);

      await waitFor(() => {
        expect(screen.getAllByRole('option').length).toBe(FRUIT_OPTIONS.length);
      });
    });

    it('calls onInputValueChange when typing', async () => {
      const user = userEvent.setup();
      const handleInputChange = vi.fn();
      render(<BasicCombobox onInputValueChange={handleInputChange} />);

      const input = screen.getByRole('combobox');
      await user.type(input, 'a');

      expect(handleInputChange).toHaveBeenCalledWith('a');
    });
  });

  describe('Grouping and Labels', () => {
    it('renders grouped options', async () => {
      const user = userEvent.setup();
      render(
        <Combobox>
          <Combobox.Input placeholder='Select' />
          <Combobox.Content>
            <Combobox.Group>
              <Combobox.Label>Fruits</Combobox.Label>
              <Combobox.Item value='apple'>Apple</Combobox.Item>
              <Combobox.Item value='banana'>Banana</Combobox.Item>
            </Combobox.Group>
            <Combobox.Separator />
            <Combobox.Group>
              <Combobox.Label>Vegetables</Combobox.Label>
              <Combobox.Item value='carrot'>Carrot</Combobox.Item>
              <Combobox.Item value='broccoli'>Broccoli</Combobox.Item>
            </Combobox.Group>
          </Combobox.Content>
        </Combobox>
      );

      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Fruits')).toBeInTheDocument();
        expect(screen.getByText('Vegetables')).toBeInTheDocument();
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Carrot')).toBeInTheDocument();
      });
    });

    it('hides labels when searching', async () => {
      const user = userEvent.setup();
      render(
        <Combobox>
          <Combobox.Input placeholder='Select' />
          <Combobox.Content>
            <Combobox.Group>
              <Combobox.Label>Fruits</Combobox.Label>
              <Combobox.Item value='apple'>Apple</Combobox.Item>
            </Combobox.Group>
          </Combobox.Content>
        </Combobox>
      );

      const input = screen.getByRole('combobox');
      await user.type(input, 'app');

      await waitFor(() => {
        expect(screen.queryByText('Fruits')).not.toBeInTheDocument();
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });
    });
  });

  describe('Controlled Mode', () => {
    it('works as controlled open state', () => {
      const { rerender } = render(
        <Combobox open={false}>
          <Combobox.Input placeholder='Select' />
          <Combobox.Content>
            <Combobox.Item value='option1'>Option 1</Combobox.Item>
          </Combobox.Content>
        </Combobox>
      );

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

      rerender(
        <Combobox open={true}>
          <Combobox.Input placeholder='Select' />
          <Combobox.Content>
            <Combobox.Item value='option1'>Option 1</Combobox.Item>
          </Combobox.Content>
        </Combobox>
      );

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('calls onOpenChange when state changes', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<BasicCombobox onOpenChange={onOpenChange} />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });
    });

    it('works with controlled input value', () => {
      const handleInputChange = vi.fn();
      render(
        <BasicCombobox
          inputValue='test'
          onInputValueChange={handleInputChange}
        />
      );

      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('test');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA roles', async () => {
      const user = userEvent.setup();
      render(<BasicCombobox />);

      const input = screen.getByRole('combobox');
      expect(input).toBeInTheDocument();

      await user.click(input);

      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(listbox).toBeInTheDocument();
      });
    });

    it('marks selected items correctly', async () => {
      render(<BasicCombobox defaultValue='apple' defaultOpen />);

      await waitFor(() => {
        const appleOption = screen
          .getByText('Apple')
          .closest('[role="option"]');
        expect(appleOption).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('options have correct role', async () => {
      const user = userEvent.setup();
      render(<BasicCombobox />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options.length).toBe(FRUIT_OPTIONS.length);
      });
    });
  });

  describe('Item without explicit value', () => {
    it('uses children text as value when value prop is not provided', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <Combobox onValueChange={handleValueChange}>
          <Combobox.Input placeholder='Select' />
          <Combobox.Content>
            <Combobox.Item>Apple</Combobox.Item>
            <Combobox.Item>Banana</Combobox.Item>
          </Combobox.Content>
        </Combobox>
      );

      const input = screen.getByRole('combobox');
      await user.click(input);

      const appleOption = await screen.findByText('Apple');
      await clickOption(appleOption);

      expect(handleValueChange).toHaveBeenCalledWith('Apple');
    });
  });
});
