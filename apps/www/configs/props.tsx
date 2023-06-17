/* eslint-disable react/jsx-key */
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Code, Flex, Popover } from "@raystack/apsara";
import React from "react";

type ComponentProps = {
  [index: string]: {
    headers: string[];
    rows: Rows;
  };
};

type Rows = Row[];
type Row = Column[];
type Column = string | React.ReactNode;

const CodeText = ({ children }: { children: React.ReactNode }) => (
  <Code css={{ whiteSpace: "break-spaces" }}>{children}</Code>
);

const Info = ({ children }: { children: React.ReactNode }) => (
  <Popover>
    <Popover.Trigger asChild>
      <InfoCircledIcon />
    </Popover.Trigger>
    <Popover.Content css={{ bg: "white" }} side="top">
      {children}
    </Popover.Content>
  </Popover>
);

const props = {
  button: {
    headers: ["Prop", "Type", "Default"],
    rows: [
      [
        <Flex gap="1" align="center">
          variant
          <InfoCircledIcon />
        </Flex>,
        <CodeText>primary | secondary | outline | ghost | danger</CodeText>,
        "-",
      ],
      ["size", <CodeText>small | medium | circle</CodeText>, "-"],
      ["disabled", <CodeText>bool</CodeText>, <CodeText>false</CodeText>],
      [
        "ref",
        <CodeText>
          <>{`Ref<HTMLButtonElement | null>`}</>
        </CodeText>,
        <CodeText>false</CodeText>,
      ],
      [
        "...",
        <CodeText>ButtonHTMLAttributes</CodeText>,
        "id | className | ...",
      ],
    ] as Rows,
  },
} as ComponentProps;
export default props;
