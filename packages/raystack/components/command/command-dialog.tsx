'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { cx } from 'class-variance-authority';
import { forwardRef, useRef } from 'react';
import styles from './command.module.css';

export const CommandDialog = (props: DialogPrimitive.Root.Props) => (
  <DialogPrimitive.Root {...props} />
);
CommandDialog.displayName = 'Command.Dialog';

export const CommandDialogTrigger = forwardRef<
  HTMLButtonElement,
  DialogPrimitive.Trigger.Props
>((props, ref) => <DialogPrimitive.Trigger ref={ref} {...props} />);
CommandDialogTrigger.displayName = 'Command.DialogTrigger';

export interface CommandDialogContentProps extends DialogPrimitive.Popup.Props {
  width?: string | number;
}

export function CommandDialogContent({
  className,
  children,
  width,
  style,
  ...props
}: CommandDialogContentProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  /* Remember what had focus before the palette opened. Base UI otherwise
     always returns focus to the trigger on close, so the trigger shows a focus
     ring even when the palette was opened by a keyboard shortcut (the trigger
     was never focused). Restoring the real origin matches how command palettes
     usually behave: focus goes back to the trigger only when you opened it by
     clicking the trigger. */
  const originRef = useRef<HTMLElement | null>(null);

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Viewport className={styles.viewport}>
        <DialogPrimitive.Popup
          ref={popupRef}
          className={cx(styles.dialogPopup, className)}
          style={{ width, ...style }}
          initialFocus={openType => {
            /* Runs before focus moves into the popup, so activeElement is
               still the element focused before opening. */
            originRef.current = document.activeElement as HTMLElement | null;
            /* Keep Base UI's default: focus the popup on touch to avoid
               popping the on-screen keyboard, otherwise the first tabbable. */
            return openType === 'touch' ? popupRef.current : true;
          }}
          finalFocus={() => {
            const origin = originRef.current;
            /* Only restore to a real, still-connected element. Returning false
               skips focus return (Base UI would otherwise fall back to the
               trigger or the page's first tabbable). */
            return origin && origin !== document.body && origin.isConnected
              ? origin
              : false;
          }}
          {...props}
        >
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}
CommandDialogContent.displayName = 'Command.DialogContent';
