import { cva, VariantProps } from "class-variance-authority";
import { PropsWithChildren, ReactNode } from "react";
import { Flex } from "~/flex";
import { Link } from "~/link";
import { Text } from "~/text";
import styles from "./sidebar.module.css";

type SidebarRootProps = VariantProps<typeof Flex> & { children?: ReactNode };
const baseLogo = <img src="./logo.svg" alt="apsara" width={16} height={16} />;

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
  onClick?: () => void;
};

const SidebarLogo = ({
  img = baseLogo,
  name = "Apsara",
  onClick,
}: SidebarLogoProps) => {
  return (
    <Flex
      align="center"
      direction="row"
      gap="small"
      className={styles.logo}
      onClick={onClick}
    >
      {img}
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

type SidebarNavigationCellProps = PropsWithChildren<
  VariantProps<typeof cell>
> & {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  children?: string;
  href?: string;
};

const SidebarNavigationCell = ({
  leadingIcon,
  trailingIcon,
  active,
  disabled,
  children,
  href = "#",
}: SidebarNavigationCellProps) => {
  return (
    <Link className={cell({ active, disabled })} href={href}>
      <Flex gap="small">
        {leadingIcon}
        <Text className={styles.cellText}>{children}</Text>
      </Flex>
      {trailingIcon}
    </Link>
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
  NavigationCell: SidebarNavigationCell,
  Footer: SidebarFooter,
});
