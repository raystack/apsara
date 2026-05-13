import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';

import styles from './list.module.css';

const list = cva(styles.list);
const listItem = cva(styles['list-item']);
const label = cva(styles.label);
const value = cva(styles.value);
const header = cva(styles.header);
const headerText = cva(styles['header-text']);

interface ListRootProps
  extends ComponentProps<'ul'>,
    VariantProps<typeof list> {
  children: ReactNode;
  maxWidth?: string | number;
}

interface ListItemProps extends ComponentProps<'li'> {
  children: ReactNode;
}

interface ListLabelProps extends ComponentProps<'span'> {
  minWidth?: string;
  children: ReactNode;
}

interface ListValueProps extends ComponentProps<'span'> {
  children: ReactNode;
}

interface ListHeaderProps extends ComponentProps<'div'> {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const ListRoot = ({
  children,
  className,
  maxWidth,
  style,
  ...props
}: ListRootProps) => {
  return (
    <ul
      className={list({ className })}
      style={{ maxWidth, ...style }}
      // `list-style: none` causes Safari/VoiceOver to drop the implicit
      // list role; keep the explicit role so the list stays announced.
      role='list'
      {...props}
    >
      {children}
    </ul>
  );
};

const ListItem = ({ children, className, ...props }: ListItemProps) => {
  return (
    <li className={listItem({ className })} {...props}>
      {children}
    </li>
  );
};

const ListLabel = ({
  children,
  minWidth,
  className,
  style,
  ...props
}: ListLabelProps) => {
  return (
    <span
      className={label({ className })}
      style={{ minWidth, ...style }}
      {...props}
    >
      {children}
    </span>
  );
};

const ListValue = ({ children, className, ...props }: ListValueProps) => {
  return (
    <span className={value({ className })} {...props}>
      {children}
    </span>
  );
};

const ListHeader = ({
  children,
  className,
  level = 3,
  ...props
}: ListHeaderProps) => {
  return (
    <div
      className={header({ className })}
      role='heading'
      aria-level={level}
      {...props}
    >
      <span className={headerText()}>{children}</span>
    </div>
  );
};

ListRoot.displayName = 'List';
ListHeader.displayName = 'List.Header';
ListItem.displayName = 'List.Item';
ListLabel.displayName = 'List.Label';
ListValue.displayName = 'List.Value';

export const List = Object.assign(ListRoot, {
  Header: ListHeader,
  Item: ListItem,
  Label: ListLabel,
  Value: ListValue
});
