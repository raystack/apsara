'use client';

import {
  Autocomplete as AutocompletePrimitive,
  Menu as MenuPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ComponentProps, Fragment, ReactNode } from 'react';
import { useItemCount } from '~/shared/item-count';
import styles from './menu.module.css';
import { useMenuContext } from './menu-root';

export function MenuGroup({
  className,
  children,
  ...props
}: MenuPrimitive.Group.Props) {
  const { shouldFilter } = useMenuContext();

  if (shouldFilter) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <MenuPrimitive.Group
      data-slot='menu-group'
      className={cx(className)}
      {...props}
    >
      {children}
    </MenuPrimitive.Group>
  );
}
MenuGroup.displayName = 'Menu.Group';

export function MenuLabel({
  className,
  ...props
}: MenuPrimitive.GroupLabel.Props) {
  const { shouldFilter } = useMenuContext();

  if (shouldFilter) {
    return null;
  }

  return (
    <MenuPrimitive.GroupLabel
      data-slot='menu-label'
      className={cx(styles.label, className)}
      {...props}
    />
  );
}
MenuLabel.displayName = 'Menu.Label';

export function MenuSeparator({ className, ...props }: ComponentProps<'div'>) {
  const { shouldFilter } = useMenuContext();

  if (shouldFilter) {
    return null;
  }

  return (
    <div
      data-slot='menu-separator'
      role='separator'
      className={cx(styles.separator, className)}
      {...props}
    />
  );
}
MenuSeparator.displayName = 'Menu.Separator';

export interface MenuEmptyStateProps extends ComponentProps<'div'> {
  children: ReactNode;
}

/** @remarks Only for internal usage. */
export function EmptyStateBase({
  slotPrefix,
  className,
  children,
  ...props
}: MenuEmptyStateProps & { slotPrefix: string }) {
  const { autocomplete } = useMenuContext();
  const count = useItemCount();
  const content = count ? null : children;
  const sharedProps = {
    'data-slot': `${slotPrefix}-empty-state`,
    className: cx(styles.empty, className)
  };

  if (autocomplete) {
    return (
      <AutocompletePrimitive.Empty {...sharedProps} {...props}>
        {content}
      </AutocompletePrimitive.Empty>
    );
  }

  return (
    <div
      {...sharedProps}
      role='status'
      aria-live='polite'
      aria-atomic
      {...props}
    >
      {content}
    </div>
  );
}

export function MenuEmptyState(props: MenuEmptyStateProps) {
  return <EmptyStateBase slotPrefix='menu' {...props} />;
}
MenuEmptyState.displayName = 'Menu.EmptyState';

export interface MenuStatusProps
  extends Omit<ComponentProps<'div'>, 'children'> {
  /** Text to announce. Receives the number of matching items. */
  children?: ReactNode | ((count: number) => ReactNode);
}

const defaultStatus = (count: number) =>
  `${count} ${count === 1 ? 'result' : 'results'}`;

/** @remarks Only for internal usage. */
export function StatusBase({
  slotPrefix,
  className,
  children = defaultStatus,
  ...props
}: MenuStatusProps & { slotPrefix: string }) {
  const { autocomplete, inputValue } = useMenuContext();
  const count = useItemCount() ?? 0;

  if (!autocomplete) return null;

  const content = inputValue
    ? typeof children === 'function'
      ? children(count)
      : children
    : null;

  return (
    <AutocompletePrimitive.Status
      data-slot={`${slotPrefix}-status`}
      className={cx(styles.status, className)}
      {...props}
    >
      {content}
    </AutocompletePrimitive.Status>
  );
}

export function MenuStatus(props: MenuStatusProps) {
  return <StatusBase slotPrefix='menu' {...props} />;
}
MenuStatus.displayName = 'Menu.Status';
