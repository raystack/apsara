'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { cx } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import styles from './command.module.css';

export const CommandDialogRoot = DialogPrimitive.Root;

export const CommandDialogTrigger = DialogPrimitive.Trigger;

export const CommandDialogClose = DialogPrimitive.Close;

export const CommandDialogTitle = DialogPrimitive.Title;

export const CommandDialogDescription = DialogPrimitive.Description;

export interface CommandDialogContentProps extends DialogPrimitive.Popup.Props {
  /** Props forwarded to the underlying `Dialog.Portal`. */
  portalProps?: ComponentProps<typeof DialogPrimitive.Portal>;
  /** Override the class applied to the backdrop. */
  backdropClassName?: string;
  /** Override the class applied to the viewport. */
  viewportClassName?: string;
}

export const CommandDialogContent = ({
  className,
  children,
  portalProps,
  backdropClassName,
  viewportClassName,
  ...props
}: CommandDialogContentProps) => {
  return (
    <DialogPrimitive.Portal {...portalProps}>
      <DialogPrimitive.Backdrop
        className={cx(styles.backdrop, backdropClassName)}
      />
      <DialogPrimitive.Viewport
        className={cx(styles.viewport, viewportClassName)}
      >
        <DialogPrimitive.Popup
          className={cx(styles.dialogPopup, className)}
          {...props}
        >
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
};
CommandDialogContent.displayName = 'Command.Dialog.Content';
