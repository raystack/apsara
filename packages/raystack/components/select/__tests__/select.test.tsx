import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from '../select';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

describe('Select', () => {
  describe('Basic Rendering', () => {
    it('renders select trigger', () => {
      render(
        <Select>
          <Select.Trigger>
            <Select.Value placeholder='Select option' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
            <Select.Item value='option2'>Option 2</Select.Item>
          </Select.Content>
        </Select>
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select option')).toBeInTheDocument();
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
            <Select.Value placeholder='Select' />
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
    it('displays selected value', () => {
      render(
        <Select defaultValue='option1'>
          <Select.Trigger>
            <Select.Value placeholder='Select option' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
            <Select.Item value='option2'>Option 2</Select.Item>
          </Select.Content>
        </Select>
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('works as controlled component', () => {
      const handleValueChange = vi.fn();
      render(
        <Select value='option1' onValueChange={handleValueChange}>
          <Select.Trigger>
            <Select.Value placeholder='Select option' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='option1'>Option 1</Select.Item>
            <Select.Item value='option2'>Option 2</Select.Item>
          </Select.Content>
        </Select>
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });
});
