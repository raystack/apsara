import { cva, VariantProps } from "class-variance-authority";
import { PropsWithChildren, ReactNode } from "react";
import { Flex } from "~/flex";
import { Text } from "~/text";

import styles from "./sidebar.module.css";

/**
 * @deprecated Use Sidepanel component from @raystack/apsara/v1 instead.
 */
type SidebarRootProps = PropsWithChildren<VariantProps<typeof Flex>> & {
  children?: ReactNode;
};

/**
 * @deprecated Use Sidepanel component from @raystack/apsara/v1 instead.
 */
const SidebarRoot = ({ children, ...props }: SidebarRootProps) => {
  return (
    <Flex
      direction="column"
      justify="between"
      className={styles.sidebar}
      {...props}
    >
      {children}
    </Flex>
  );
};

/**
 * @deprecated Use Sidepanel.Header component from @raystack/apsara/v1 instead.
 */
type SidebarLogoProps = {
  img?: ReactNode;
  name?: string;
  logo?: ReactNode;
  onClick?: () => void;
};

/**
 * @deprecated Use Sidepanel.Header component from @raystack/apsara/v1 instead.
 */
const SidebarLogo = ({
  name = "Apsara",
  logo,
  onClick,
  ...props
}: SidebarLogoProps) => {
  return (
    <Flex
      align="center"
      direction="row"
      gap="small"
      onClick={onClick}
      {...props}
    >
      <Flex gap="small">{logo}</Flex>
      <Text size={2} className={styles.logo}>
        {name}
      </Text>
    </Flex>
  );
};

/**
 * @deprecated Use Sidepanel.Main component from @raystack/apsara/v1 instead.
 */
type SidebarNavigationsProps = PropsWithChildren<VariantProps<typeof Flex>>;

/**
 * @deprecated Use Sidepanel.Main component from @raystack/apsara/v1 instead.
 */
const SidebarNavigations = ({
  children,
  ...props
}: SidebarNavigationsProps) => {
  return (
    <Flex direction="column" gap={"extra-small"} {...props}>
      {children}
    </Flex>
  );
};

/**
 * @deprecated Use Sidepanel.Item component from @raystack/apsara/v1 instead.
 */
type SidebarNavigationsGroupProps = PropsWithChildren<
  VariantProps<typeof Flex> & { icon?: React.ReactNode; name: string }
>;

/**
 * @deprecated Use Sidepanel.Item component from @raystack/apsara/v1 instead.
 */
const SidebarNavigationsGroup = ({
  icon,
  name,
  children,
  ...props
}: SidebarNavigationsGroupProps) => {
  return (
    <Flex direction="column" className={styles.navigationgroup} {...props}>
      <Flex className={styles.navigationgroupheading}>
        {icon && icon}
        <Text size={2} style={{ color: "var(--foreground-muted)" }}>
          {name}
        </Text>
      </Flex>
      <Flex direction="column" className={styles.navigationgroupcontent}>
        {children}
      </Flex>
    </Flex>
  );
};

const cell = cva(styles.cell, {
  variants: {
    active: {
      true: styles.active,
    },
    disabled: {
      true: styles.disabled,
    },
  },
});

type SidebarNavigationCellProps = PropsWithChildren<VariantProps<typeof cell>> &
  VariantProps<typeof Flex> & {
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    children?: React.ReactNode;
    onClick?: () => void;
    href?: string;
  };

/**
 * @deprecated Use Sidepanel component from @raystack/apsara/v1 instead.
 */
const SidebarNavigationCell = ({
  leadingIcon,
  trailingIcon,
  active,
  disabled,
  children,
  asChild = false,
  ...props
}: SidebarNavigationCellProps & { asChild?: boolean }) => {
  return (
    <Flex className={cell({ active, disabled })} {...props}>
      {asChild ? (
        children
      ) : (
        <>
          <Flex gap="small">
            {leadingIcon}
            <Text className={styles.cellText}>{children}</Text>
          </Flex>
          {trailingIcon}
        </>
      )}
    </Flex>
  );
};

type SidebarFooterProps = {
  children?: string;
  action?: ReactNode;
};

/**
 * @deprecated Use Sidepanel component from @raystack/apsara/v1 instead.
 */
const SidebarFooter = ({ children, action }: SidebarFooterProps) => {
  return (
    <Flex className={styles.footer} gap="small" justify="between">
      <Text>{children}</Text>
      {action}
    </Flex>
  );
};

/**
 * @deprecated Use Sidepanel component from @raystack/apsara/v1 instead.
 */
export const Sidebar = Object.assign(SidebarRoot, {
  Logo: SidebarLogo,
  Navigations: SidebarNavigations,
  NavigationGroup: SidebarNavigationsGroup,
  NavigationCell: SidebarNavigationCell,
  Footer: SidebarFooter,
});
