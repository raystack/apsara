'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { cx } from 'class-variance-authority';
import { forwardRef, useRef } from 'react';
import {
  type PortalContainer,
  useThemeInjection
} from '../theme-preview/portal';
import { radiusClass } from '../theme-preview/radius';
import type { Radius } from '../theme-preview/settings';
import styles from './command.module.css';

export const CommandDialog = (props: DialogPrimitive.Root.Props) => (
  <DialogPrimitive.Root {...props} />
);
CommandDialog.displayName = 'Command.Dialog';

export const CommandDialogTrigger = forwardRef<
  HTMLButtonElement,
  DialogPrimitive.Trigger.Props
>((props, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    data-slot='command-dialog-trigger'
    {...props}
  />
));
CommandDialogTrigger.displayName = 'Command.DialogTrigger';

export interface CommandDialogContentProps extends DialogPrimitive.Popup.Props {
  width?: string | number;
  /** Portals into this element instead of `document.body`. */
  container?: PortalContainer;
  /** Corner radius for this palette only. Overrides the theme's `radius`. */
  radius?: Radius;
}

export function CommandDialogContent({
  className,
  children,
  width,
  style,
  container,
  radius,
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
  const theme = useThemeInjection();

  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Viewport
        data-slot='command-dialog-viewport'
        className={styles.viewport}
      >
        <DialogPrimitive.Popup
          ref={popupRef}
          {...theme}
          data-slot='command-dialog-content'
          className={cx(
            styles.dialogPopup,
            theme?.className,
            radiusClass(radius),
            className
          )}
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
