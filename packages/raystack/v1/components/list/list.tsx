import { cva, type VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./list.module.css";

const list = cva(styles.list);
const listItem = cva(styles["list-item"], {
  variants: {
    align: {
      start: styles["list-item-start"],
      center: styles["list-item-center"],
      end: styles["list-item-end"],
    },
  },
  defaultVariants: {
    align: "start",
  },
});

const label = cva(styles.label);
const value = cva(styles.value);

const header = cva(styles.header);
const headerText = cva(styles["header-text"]);

interface ListRootProps extends ComponentPropsWithoutRef<"ul">, VariantProps<typeof list> {
  children: ReactNode;
  maxWidth?: string | number;
}

interface ListItemProps extends ComponentPropsWithoutRef<"li"> {
  align?: "start" | "center" | "end";
  children: ReactNode;
}

interface ListLabelProps extends ComponentPropsWithoutRef<"span"> {
  minWidth?: string;
  children: ReactNode;
}

interface ListValueProps extends ComponentPropsWithoutRef<"span"> {
  children: ReactNode;
}

interface ListHeaderProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

const ListRoot = ({ children, className, maxWidth, style, ...props }: ListRootProps) => {
  return (
    <ul 
      className={list({ className })} 
      style={{ maxWidth, ...style }} 
      role="list"
      aria-label={props['aria-label'] || "List"}
      {...props}
    >
      {children}
    </ul>
  );
};

const ListItem = ({ children, align, className, ...props }: ListItemProps) => {
  return (
    <li 
      className={listItem({ align, className })} 
      role="listitem"
      {...props}
    >
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

const ListValue = ({ 
  children,
  className,
  ...props 
}: ListValueProps) => {
  return (
    <span className={value({ className })} {...props}>
      {children}
    </span>
  );
};

const ListHeader = ({ children, className, ...props }: ListHeaderProps) => {
  return (
    <div 
      className={header({ className })} 
      role="heading"
      aria-level={3}
      {...props}
    >
      <span className={headerText()}>{children}</span>
    </div>
  );
};

export const List = {
  Root: ListRoot,
  Header: ListHeader,
  Item: ListItem,
  Label: ListLabel,
  Value: ListValue,
};

ListRoot.displayName = "List";
ListHeader.displayName = "ListHeader";
ListItem.displayName = "ListItem";
ListLabel.displayName = "ListLabel";
ListValue.displayName = "ListValue";