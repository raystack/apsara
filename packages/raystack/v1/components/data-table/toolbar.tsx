import clsx from "clsx";
import { Flex } from "../flex";
import styles from "./data-table.module.css";
import { Button } from "../button";
import { Popover } from "../popover";
import { FilterIcon } from "../icons";
import {
  MixerHorizontalIcon,
  TextAlignBottomIcon,
} from "@radix-ui/react-icons";
import { Text } from "../text";
import { Label } from "../label";
import { Select } from "../select";
import { Chip } from "../chip";

export function Toolbar({ className }: { className?: string }) {
  return (
    <Flex
      className={clsx(styles["toolbar"], className)}
      justify={"between"}
      align={"center"}
    >
      <Flex>
        <Button variant={"text"} size={"small"} leadingIcon={<FilterIcon />}>
          Filter
        </Button>
      </Flex>
      <Popover>
        <Popover.Trigger asChild>
          <Button
            variant={"outline"}
            color="neutral"
            size={"small"}
            leadingIcon={<MixerHorizontalIcon />}
          >
            Display
          </Button>
        </Popover.Trigger>
        <Popover.Content
          className={styles["display-popover-content"]}
          align="end"
        >
          <Flex direction={"column"}>
            <Flex
              direction={"column"}
              className={styles["display-popover-properties-container"]}
              gap={5}
            >
              <Flex justify="between" align="center">
                <Text size={2} weight={500}>
                  Ordering
                </Text>
                <Flex gap={"extra-small"}>
                  <Select>
                    <Select.Trigger variant="filter">
                      <div className={styles.selectValue}>
                        <Select.Value placeholder="Select value" />
                      </div>
                    </Select.Trigger>
                    <Select.Content data-variant="filter"></Select.Content>
                  </Select>
                  <TextAlignBottomIcon
                    className={styles["display-popover-sort-icon"]}
                  />
                </Flex>
              </Flex>
              <Flex justify="between" align="center">
                <Text size={2} weight={500}>
                  Grouping
                </Text>
                <Select>
                  <Select.Trigger variant="filter">
                    <div className={styles.selectValue}>
                      <Select.Value placeholder="Select value" />
                    </div>
                  </Select.Trigger>
                  <Select.Content data-variant="filter"></Select.Content>
                </Select>
              </Flex>
            </Flex>
            <Flex
              direction={"column"}
              className={styles["display-popover-properties-container"]}
              gap={5}
            >
              <Label>Display Properties</Label>
              <Flex gap={3}>
                <Chip variant="outline" size="small">
                  Label
                </Chip>
                <Chip variant="outline" size="small" style="accent">
                  Label
                </Chip>
              </Flex>
            </Flex>
            <Flex
              justify={"end"}
              className={styles["display-popover-reset-container"]}
            >
              <Button variant={"text"}>Reset to default</Button>
            </Flex>
          </Flex>
        </Popover.Content>
      </Popover>
    </Flex>
  );
}
