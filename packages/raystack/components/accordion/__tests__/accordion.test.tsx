import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Accordion } from '../accordion';
import styles from '../accordion.module.css';

describe('Accordion', () => {
  describe('Basic Rendering', () => {
    it('renders accordion with children', () => {
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      expect(
        screen.getByRole('button', { name: 'Item 1' })
      ).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('renders multiple accordion items', () => {
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value='item-2'>
            <Accordion.Trigger>Item 2</Accordion.Trigger>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      expect(
        screen.getByRole('button', { name: 'Item 1' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Item 2' })
      ).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('applies custom className to accordion', () => {
      render(
        <Accordion className='custom-accordion'>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const accordion = screen.getByRole('region');
      expect(accordion).toHaveClass('custom-accordion');
      expect(accordion).toHaveClass(styles.accordion);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Accordion ref={ref}>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('AccordionItem', () => {
    it('renders with correct data attributes', () => {
      render(
        <Accordion>
          <Accordion.Item value='item-1' className='custom-item'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const item = screen
        .getByRole('button', { name: 'Item 1' })
        .closest('[data-slot="accordion-item"]');
      expect(item).toHaveClass('custom-item');
      expect(item).toHaveClass(styles['accordion-item']);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Accordion>
          <Accordion.Item ref={ref} value='item-1'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('AccordionTrigger', () => {
    it('renders with correct data attributes', () => {
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger className='custom-trigger'>
              Item 1
            </Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: 'Item 1' });
      expect(trigger).toHaveClass('custom-trigger');
      expect(trigger).toHaveClass(styles['accordion-trigger']);
    });

    it('renders with chevron icon', () => {
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const icon = screen
        .getByRole('button', { name: 'Item 1' })
        .querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(styles['accordion-icon']);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger ref={ref}>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('handles click events', () => {
      const handleClick = vi.fn();
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger onClick={handleClick}>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: 'Item 1' });
      fireEvent.click(trigger);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles disabled state', () => {
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger disabled>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: 'Item 1' });
      expect(trigger).toBeDisabled();
    });
  });

  describe('AccordionContent', () => {
    it('renders with correct data attributes', () => {
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content className='custom-content'>
              Content 1
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const content = screen
        .getByText('Content 1')
        .closest('[data-slot="accordion-content"]');
      expect(content).toHaveClass('custom-content');
      expect(content).toHaveClass(styles['accordion-content']);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content ref={ref}>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Size Variants', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    it.each(sizes)('renders %s size correctly', size => {
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger size={size}>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: 'Item 1' });
      expect(trigger).toHaveClass(styles[`accordion-trigger-${size}`]);
    });

    it('defaults to medium size', () => {
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: 'Item 1' });
      expect(trigger).toHaveClass(styles['accordion-trigger-medium']);
    });
  });

  describe('Interaction', () => {
    it('expands and collapses content on trigger click', () => {
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: 'Item 1' });

      // Initially closed
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      // Click to open
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Click to close
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('rotates icon when expanded', () => {
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: 'Item 1' });

      // Initially not rotated
      expect(trigger).not.toHaveAttribute('data-state', 'open');

      // Click to open
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('data-state', 'open');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: 'Item 1' });

      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-controls');
    });

    it('supports keyboard navigation', () => {
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: 'Item 1' });

      // Focus should work
      trigger.focus();
      expect(trigger).toHaveFocus();

      // Enter key should toggle
      fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('supports aria-label on trigger', () => {
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger aria-label='Custom label'>
              Item 1
            </Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });
  });

  describe('Multiple Items', () => {
    it('handles multiple accordion items independently', () => {
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>Item 1</Accordion.Trigger>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value='item-2'>
            <Accordion.Trigger>Item 2</Accordion.Trigger>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger1 = screen.getByRole('button', { name: 'Item 1' });
      const trigger2 = screen.getByRole('button', { name: 'Item 2' });

      // Open first item
      fireEvent.click(trigger1);
      expect(trigger1).toHaveAttribute('aria-expanded', 'true');
      expect(trigger2).toHaveAttribute('aria-expanded', 'false');

      // Open second item
      fireEvent.click(trigger2);
      expect(trigger1).toHaveAttribute('aria-expanded', 'true');
      expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
