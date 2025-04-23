import {
  ElementRef,
  forwardRef,
  Fragment,
  HTMLAttributes,
  ReactNode,
} from "react";
import {
  MenuGroup,
  MenuGroupLabel,
  MenuGroupLabelProps,
  MenuGroupProps,
  MenuSeparator,
  MenuSeparatorProps,
} from "@ariakit/react";
import { Slot } from "@radix-ui/react-slot";
import { cx } from "class-variance-authority";
import { WithAsChild } from "./types";
import styles from "./dropdown-menu.module.css";
import { useDropdownContext } from "./dropdown-menu-root";

export const DropdownMenuGroup = forwardRef<
  ElementRef<typeof MenuGroup>,
  WithAsChild<MenuGroupProps>
>(({ className, asChild, ...props }, ref) => {
  const { shouldFilter } = useDropdownContext();

  return (
    <MenuGroup
      ref={ref}
      className={cx(styles.menugroup, className)}
      render={shouldFilter ? <Fragment /> : asChild ? <Slot /> : undefined}
      {...props}
    />
  );
});

export const DropdownMenuLabel = forwardRef<
  ElementRef<typeof MenuGroupLabel>,
  WithAsChild<MenuGroupLabelProps>
>(({ className, asChild, ...props }, ref) => {
  const { shouldFilter } = useDropdownContext();

  if (shouldFilter) {
    return null;
  }

  return (
    <MenuGroupLabel
      ref={ref}
      className={cx(styles.label, className)}
      render={asChild ? <Slot /> : undefined}
      {...props}
    />
  );
});

export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof MenuSeparator>,
  WithAsChild<MenuSeparatorProps>
>(({ className, asChild, ...props }, ref) => {
  const { shouldFilter } = useDropdownContext();

  if (shouldFilter) {
    return null;
  }

  return (
    <MenuSeparator
      ref={ref}
      className={cx(styles.separator, className)}
      render={asChild ? <Slot /> : undefined}
      {...props}
    />
  );
});

export const DropdownMenuEmptyState = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cx(styles.empty, className)} {...props}>
    {children}
  </div>
));
