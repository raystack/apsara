import styles from "./announcementBar.module.css";

import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import { Flex } from "../flex";
import { Text } from "../text";

const announementBar = cva(styles["announcement-bar"], {
  variants: {
    variant: {
      gradient: [styles["announcement-bar-gradient"]],
      normal: styles["announcement-bar-normal"],
      error: styles["announcement-bar-error"],
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

type AnnouncementBarProps = VariantProps<typeof announementBar> & {
  leadingIcon?: ReactNode;
  className?: string;
  text: string;
};

export const AnnouncementBar = ({
  className,
  variant,
  text,
  leadingIcon,
  ...props
}: AnnouncementBarProps) => {
  return (
    <Flex
      className={announementBar({ className, variant })}
      justify={"center"}
      align={"center"}
      gap={"small"}
      {...props}
    >
      {leadingIcon && <span className={styles["icon"]}>{leadingIcon}</span>}
      <Text className={styles.text} size={2} weight={500}>
        {text}
      </Text>
    </Flex>
  );
};
