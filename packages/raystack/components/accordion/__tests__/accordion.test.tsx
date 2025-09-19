import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Accordion } from '../accordion';
import { AccordionRootProps } from '../accordion-root';
import styles from '../accordion.module.css';

const ITEM_1_TEXT = 'Item 1';
const ITEM_2_TEXT = 'Item 2';
const CONTENT_1_TEXT = 'Content 1';
const CONTENT_2_TEXT = 'Content 2';

const BasicAccordion = ({
  hasDisabledItem = false,
  children,
  ...props
}: AccordionRootProps & { hasDisabledItem?: boolean }) => {
  return (
    <Accordion {...props}>
      <Accordion.Item value='item-1'>
        <Accordion.Trigger>{ITEM_1_TEXT}</Accordion.Trigger>
        <Accordion.Content>{CONTENT_1_TEXT}</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value='item-2' disabled={hasDisabledItem}>
        <Accordion.Trigger>{ITEM_2_TEXT}</Accordion.Trigger>
        <Accordion.Content>{CONTENT_2_TEXT}</Accordion.Content>
      </Accordion.Item>
      {children}
    </Accordion>
  );
};

describe('Accordion', () => {
  describe('Basic Rendering', () => {
    it('renders accordion with children', () => {
      render(<BasicAccordion value='item-1' />);

      expect(
        screen.getByRole('button', { name: ITEM_1_TEXT })
      ).toBeInTheDocument();
      expect(screen.getByText(CONTENT_1_TEXT)).toBeInTheDocument();
    });

    it('renders multiple accordion items', () => {
      render(<BasicAccordion />);

      expect(
        screen.getByRole('button', { name: ITEM_1_TEXT })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: ITEM_2_TEXT })
      ).toBeInTheDocument();
    });

    it('applies custom className to accordion', () => {
      render(
        <BasicAccordion className='custom-accordion' data-testid='custom' />
      );

      const accordion = screen.getByTestId('custom');
      expect(accordion).toHaveClass('custom-accordion');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Accordion ref={ref}>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>{ITEM_1_TEXT}</Accordion.Trigger>
            <Accordion.Content>{CONTENT_1_TEXT}</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('expands and collapses content on trigger click', () => {
      render(<BasicAccordion />);

      const trigger = screen.getByRole('button', { name: ITEM_1_TEXT });

      // Initially closed
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      // Click to open
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Click to close
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion />);

      const trigger = screen.getByRole('button', { name: ITEM_2_TEXT });

      await user.keyboard('{Tab}{ArrowDown}{Enter}');

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('AccordionItem', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Accordion>
          <Accordion.Item ref={ref} value='item-1'>
            <Accordion.Trigger>{ITEM_1_TEXT}</Accordion.Trigger>
            <Accordion.Content>{CONTENT_1_TEXT}</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('AccordionTrigger', () => {
    it('renders with custom className', () => {
      render(
        <Accordion>
          <Accordion.Item value='custom'>
            <Accordion.Trigger
              className='custom-trigger'
              data-testid='custom-trigger'
            >
              {ITEM_1_TEXT}
            </Accordion.Trigger>
            <Accordion.Content>{CONTENT_1_TEXT}</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByTestId('custom-trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('renders with chevron icon', () => {
      render(<BasicAccordion />);

      const icon = screen
        .getByRole('button', { name: ITEM_1_TEXT })
        .querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(styles['accordion-icon']);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger ref={ref}>{ITEM_1_TEXT}</Accordion.Trigger>
            <Accordion.Content>{CONTENT_1_TEXT}</Accordion.Content>
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
            <Accordion.Trigger onClick={handleClick}>
              {ITEM_1_TEXT}
            </Accordion.Trigger>
            <Accordion.Content>{CONTENT_1_TEXT}</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: ITEM_1_TEXT });
      fireEvent.click(trigger);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles disabled state', () => {
      render(<BasicAccordion hasDisabledItem />);

      const trigger = screen.getByRole('button', { name: ITEM_2_TEXT });
      expect(trigger).toBeDisabled();
    });
  });

  describe('AccordionContent', () => {
    it('renders with correct className', () => {
      render(
        <Accordion value='custom'>
          <Accordion.Item value='custom'>
            <Accordion.Trigger>{ITEM_1_TEXT}</Accordion.Trigger>
            <Accordion.Content className='custom-content'>
              {CONTENT_1_TEXT}
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const content = screen.getByText(CONTENT_1_TEXT).closest('div');
      expect(content).toHaveClass('custom-content');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Accordion>
          <Accordion.Item value='item-1'>
            <Accordion.Trigger>{ITEM_1_TEXT}</Accordion.Trigger>
            <Accordion.Content ref={ref}>{CONTENT_1_TEXT}</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Multiple Items', () => {
    it('handles multiple accordion items independently', () => {
      render(<BasicAccordion type='multiple' />);

      const trigger1 = screen.getByRole('button', { name: ITEM_1_TEXT });
      const trigger2 = screen.getByRole('button', { name: ITEM_2_TEXT });

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
