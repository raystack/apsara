import React from "react";
import { VariantProps, cva } from "class-variance-authority";

import styles from "./side-panel.module.css";
import { Flex } from "../flex";
import { Text } from "../text";

const sidePanelRoot = cva(styles["side-panel"], {
  variants: {
    side: {
      left: styles["side-panel-left"],
      right: styles["side-panel-right"],
    },
  },
  defaultVariants: {
    side: "right",
  },
});

interface SidePanelProps extends VariantProps<typeof sidePanelRoot> {
  children: React.ReactNode;
  className?: string;
}

const SidePanelRoot = ({
  children,
  side = "right",
  className,
}: SidePanelProps) => {
  return (
    <aside className={sidePanelRoot({ side, className })}>{children}</aside>
  );
};

interface SidePanelHeaderProps {
  title: string;
  icon?: React.ReactNode;
  actions?: Array<React.ReactNode>;
  description?: string;
}

const SidePanelHeader = ({
  title,
  icon,
  actions = [],
  description,
}: SidePanelHeaderProps) => {
  return (
    <div className={styles["side-panel-header"]}>
      <Flex gap={3} justify="between" align="center">
        <Flex gap={3}>
          {icon}
          <Text size={5} weight={500}>
            {title}
          </Text>
        </Flex>
        <Flex gap={3}>
          {actions?.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </Flex>
      </Flex>
      {description ? <Text size={2}>{description}</Text> : null}
    </div>
  );
};

interface SidePanelSectionProps {
  children: React.ReactNode;
}

const SidePanelSection = ({ children }: SidePanelSectionProps) => {
  return <div className={styles["side-panel-section"]}>{children}</div>;
};

export const SidePanel = Object.assign(SidePanelRoot, {
  Header: SidePanelHeader,
  Section: SidePanelSection,
});
