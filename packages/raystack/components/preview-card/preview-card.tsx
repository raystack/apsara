'use client';

import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './preview-card.module.css';

export interface PreviewCardContentProps
  extends Omit<
      PreviewCardPrimitive.Positioner.Props,
      'render' | 'className' | 'style' | 'ref'
    >,
    PreviewCardPrimitive.Popup.Props {
  /**
   * Controls whether to show the arrow.
   * @default false
   */
  showArrow?: boolean;
}

function PreviewCardContent({
  ref,
  className,
  children,
  showArrow = false,
  style,
  render,
  ...positionerProps
}: PreviewCardContentProps) {
  return (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner
        sideOffset={showArrow ? 10 : 4}
        collisionPadding={3}
        className={styles.positioner}
        {...positionerProps}
      >
        <PreviewCardPrimitive.Popup
          ref={ref}
          className={cx(styles.popup, className)}
          style={style}
          render={render}
        >
          {children}
          {showArrow && (
            <PreviewCardPrimitive.Arrow className={styles.arrow}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='6'
                height='7'
                viewBox='0 0 6 7'
                fill='none'
              >
                <path
                  d='M2.90809 6.78553L0 0H6L3.09191 6.78553C3.05728 6.86634 2.94272 6.86634 2.90809 6.78553Z'
                  fill='currentColor'
                />
              </svg>
            </PreviewCardPrimitive.Arrow>
          )}
        </PreviewCardPrimitive.Popup>
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}
PreviewCardContent.displayName = 'PreviewCard.Content';

function PreviewCardViewport({
  className,
  ...props
}: PreviewCardPrimitive.Viewport.Props) {
  return (
    <PreviewCardPrimitive.Viewport
      className={cx(styles.viewport, className)}
      {...props}
    />
  );
}
PreviewCardViewport.displayName = 'PreviewCard.Viewport';

export const PreviewCard = Object.assign(PreviewCardPrimitive.Root, {
  Trigger: PreviewCardPrimitive.Trigger,
  Content: PreviewCardContent,
  Viewport: PreviewCardViewport,
  createHandle: PreviewCardPrimitive.createHandle
});
