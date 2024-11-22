import styles from "./emptyState.module.css";
import { Flex } from "../flex";
import { Text } from "../text";
import clsx from "clsx";

type classNameKeys =
  | "container"
  | "iconContainer"
  | "icon"
  | "heading"
  | "subHeading";

interface EmptystateProps {
  icon: React.ReactNode;
  heading?: React.ReactNode;
  subHeading?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  classNames?: Partial<Record<classNameKeys, string>>;
}

export const EmptyState = ({
  icon,
  heading,
  subHeading,
  primaryAction,
  secondaryAction,
  classNames,
}: EmptystateProps) => {
  return (
    <Flex
      direction="column"
      align="center"
      gap="medium"
      className={clsx(styles.emptyState, classNames?.container)}
    >
      <div className={clsx(styles.iconContainer, classNames?.iconContainer)}>
        <div className={clsx(styles.icon, classNames?.icon)}>{icon}</div>
      </div>

      <Flex direction="column" gap="small" align="center">
        {heading && (
          <Text
            size={5}
            weight={500}
            className={clsx(styles.headerText, classNames?.heading)}
          >
            {heading}
          </Text>
        )}

        {subHeading && (
          <Text
            size={4}
            weight={400}
            className={clsx(styles.subHeaderText, classNames?.subHeading)}
          >
            {subHeading}
          </Text>
        )}
      </Flex>

      {primaryAction}

      {secondaryAction}
    </Flex>
  );
};
