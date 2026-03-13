import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PreviewCard } from '../preview-card';
import styles from '../preview-card.module.css';

const TRIGGER_TEXT = 'Hover me';
const CARD_CONTENT = 'Preview card content';

const BasicPreviewCard = ({
  children = <PreviewCard.Content>{CARD_CONTENT}</PreviewCard.Content>,
  ...props
}: PreviewCardPrimitive.Root.Props) => (
  <PreviewCard {...props}>
    <PreviewCard.Trigger href='#'>{TRIGGER_TEXT}</PreviewCard.Trigger>
    {children as unknown as ReactNode}
  </PreviewCard>
);

describe('PreviewCard', () => {
  describe('Basic Rendering', () => {
    it('renders trigger', () => {
      render(<BasicPreviewCard />);
      const trigger = screen.getByText(TRIGGER_TEXT);
      expect(trigger).toBeInTheDocument();
    });

    it('renders trigger as an anchor element', () => {
      render(<BasicPreviewCard />);
      const trigger = screen.getByText(TRIGGER_TEXT);
      expect(trigger.tagName).toBe('A');
    });

    it('does not show preview card content initially', () => {
      render(<BasicPreviewCard />);
      expect(screen.queryByText(CARD_CONTENT)).not.toBeInTheDocument();
    });

    it('shows content when open is true (controlled)', async () => {
      render(<BasicPreviewCard open={true} />);

      await waitFor(() => {
        expect(screen.getByText(CARD_CONTENT)).toBeInTheDocument();
      });
    });

    it('renders in portal', async () => {
      render(<BasicPreviewCard open={true} />);

      await waitFor(() => {
        const content = screen.getByText(CARD_CONTENT);
        expect(content.closest('body')).toBe(document.body);
      });
    });
  });

  describe('Content Styling', () => {
    it('applies default popup styles', async () => {
      render(<BasicPreviewCard open={true} />);

      await waitFor(() => {
        const popup = screen
          .getByText(CARD_CONTENT)
          .closest(`.${styles.popup}`);
        expect(popup).toBeInTheDocument();
      });
    });

    it('applies custom className', async () => {
      render(
        <BasicPreviewCard open={true}>
          <PreviewCard.Content className='custom-preview'>
            {CARD_CONTENT}
          </PreviewCard.Content>
        </BasicPreviewCard>
      );

      await waitFor(() => {
        const popup = screen
          .getByText(CARD_CONTENT)
          .closest(`.${styles.popup}`);
        expect(popup).toHaveClass('custom-preview');
        expect(popup).toHaveClass(styles.popup);
      });
    });
  });

  describe('Positioning Props', () => {
    const alignValues = ['start', 'center', 'end'] as const;

    it.each(alignValues)('renders %s align', async align => {
      render(
        <BasicPreviewCard open={true}>
          <PreviewCard.Content align={align}>
            {CARD_CONTENT}
          </PreviewCard.Content>
        </BasicPreviewCard>
      );

      await waitFor(() => {
        const content = screen.getByText(CARD_CONTENT);
        const positioner = content.closest('[data-align]');
        expect(positioner).toHaveAttribute('data-align', align);
      });
    });

    const sideValues = ['top', 'right', 'bottom', 'left'] as const;

    it.each(sideValues)('renders %s side', async side => {
      render(
        <BasicPreviewCard open={true}>
          <PreviewCard.Content side={side}>{CARD_CONTENT}</PreviewCard.Content>
        </BasicPreviewCard>
      );

      await waitFor(() => {
        const content = screen.getByText(CARD_CONTENT);
        const positioner = content.closest('[data-side]');
        expect(positioner).toHaveAttribute('data-side', side);
      });
    });
  });

  describe('Arrow', () => {
    it('does not show arrow by default', async () => {
      render(<BasicPreviewCard open={true} />);

      await waitFor(() => {
        expect(screen.getByText(CARD_CONTENT)).toBeInTheDocument();
      });

      const arrow = document.querySelector(`.${styles.arrow}`);
      expect(arrow).not.toBeInTheDocument();
    });

    it('shows arrow when showArrow is true', async () => {
      render(
        <BasicPreviewCard open={true}>
          <PreviewCard.Content showArrow>{CARD_CONTENT}</PreviewCard.Content>
        </BasicPreviewCard>
      );

      await waitFor(() => {
        const arrow = document.querySelector(`.${styles.arrow}`);
        expect(arrow).toBeInTheDocument();
      });
    });
  });

  describe('Controlled Mode', () => {
    it('works as controlled component', () => {
      const { rerender } = render(
        <PreviewCard open={false}>
          <PreviewCard.Content>{CARD_CONTENT}</PreviewCard.Content>
        </PreviewCard>
      );

      expect(screen.queryByText(CARD_CONTENT)).not.toBeInTheDocument();

      rerender(
        <PreviewCard open={true}>
          <PreviewCard.Content>{CARD_CONTENT}</PreviewCard.Content>
        </PreviewCard>
      );

      expect(screen.getByText(CARD_CONTENT)).toBeInTheDocument();
    });

    it('calls onOpenChange when state changes', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<BasicPreviewCard open={false} onOpenChange={onOpenChange} />);

      const trigger = screen.getByText(TRIGGER_TEXT);
      await user.hover(trigger);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('trigger has proper link role', () => {
      render(<BasicPreviewCard />);
      const trigger = screen.getByText(TRIGGER_TEXT);
      expect(trigger).toHaveAttribute('href', '#');
    });
  });
});
