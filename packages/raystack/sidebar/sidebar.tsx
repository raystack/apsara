import { cva, VariantProps } from "class-variance-authority";
import { PropsWithChildren, ReactNode } from "react";
import { Flex } from "~/flex";
import { Text } from "~/text";

import styles from "./sidebar.module.css";

type SidebarRootProps = VariantProps<typeof Flex> & { children?: ReactNode };
const SidebarRoot = ({ children }: SidebarRootProps) => {
  return (
    <Flex direction="column" justify="between" className={styles.sidebar}>
      {children}
    </Flex>
  );
};

type SidebarLogoProps = {
  img?: ReactNode;
  name?: string;
  logo?: ReactNode;
  onClick?: () => void;
};

const SidebarLogo = ({ name = "Apsara", logo, onClick }: SidebarLogoProps) => {
  return (
    <Flex
      align="center"
      direction="row"
      gap="small"
      onClick={onClick}
      className={styles.logo}
    >
      <Flex gap="small">{logo}</Flex>
      <Text>{name}</Text>
    </Flex>
  );
};

type SidebarNavigationsProps = PropsWithChildren<VariantProps<typeof Flex>>;
const SidebarNavigations = ({
  children,
  ...props
}: SidebarNavigationsProps) => {
  return (
    <Flex direction="column" className={styles.navigations} {...props}>
      {children}
    </Flex>
  );
};

type SidebarNavigationsGroupProps = PropsWithChildren<
  VariantProps<typeof Flex> & { icon?: React.ReactNode; name: string }
>;
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
  };

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

const SidebarFooter = ({ children, action }: SidebarFooterProps) => {
  return (
    <Flex className={styles.footer} gap="small" justify="between">
      <Text>{children}</Text>
      {action}
    </Flex>
  );
};

export const Sidebar = Object.assign(SidebarRoot, {
  Logo: SidebarLogo,
  Navigations: SidebarNavigations,
  NavigationGroup: SidebarNavigationsGroup,
  NavigationCell: SidebarNavigationCell,
  Footer: SidebarFooter,
});
