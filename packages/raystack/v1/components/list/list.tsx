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

interface ListRootProps extends ComponentPropsWithoutRef<"ul">, VariantProps<typeof list> {
  children: ReactNode;
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

const ListRoot = ({ children, className, ...props }: ListRootProps) => {
  return (
    <ul className={list({ className })} {...props}>
      {children}
    </ul>
  );
};

const ListItem = ({ 
  children, 
  align, 
  className,
  ...props 
}: ListItemProps) => {
  return (
    <li className={listItem({ align, className })} {...props}>
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

export const List = {
  Root: ListRoot,
  Item: ListItem,
  Label: ListLabel,
  Value: ListValue,
};

List.displayName = "List";
ListItem.displayName = "ListItem"; 