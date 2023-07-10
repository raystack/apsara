import {
  BlendingModeIcon,
  BoxIcon,
  Component2Icon,
  DotsVerticalIcon,
  FaceIcon,
  Half2Icon,
  InfoCircledIcon,
  Link2Icon,
  ReaderIcon,
  TargetIcon,
} from "@radix-ui/react-icons";
import { Flex, ScrollArea, Sidebar } from "@raystack/apsara";
import "@raystack/apsara/index.css";
import React from "react";
import { Assets } from "./assets";

const navigationList = [
  {
    href: "#shield",
    leadingIcon: <InfoCircledIcon />,
    name: "Inbox",
  },
  {
    active: true,
    href: "#assets",
    leadingIcon: <BlendingModeIcon />,
    name: "Assets",
  },
  {
    leadingIcon: <BoxIcon />,
    name: "Lineage",
    disabled: true,
  },
  {
    leadingIcon: <Component2Icon />,
    name: "Appeals",
    disabled: true,
  },
  {
    leadingIcon: <TargetIcon />,
    name: "Grants",
    disabled: true,
  },
  {
    leadingIcon: <Half2Icon />,
    name: "Policies",
    disabled: true,
  },
  {
    leadingIcon: <ReaderIcon />,
    name: "Reports",
    disabled: true,
  },
  {
    leadingIcon: <FaceIcon />,
    name: "Teams",
    disabled: true,
  },
  {
    leadingIcon: <Link2Icon />,
    name: "Connections",
    disabled: true,
  },
];

export const Shield = () => {
  return (
    <Flex style={{ height: "100%" }}>
      <Sidebar>
        <Flex direction="column">
          <Sidebar.Logo />
          <Sidebar.Navigations
            // @ts-ignore
            style={{
              marginTop: "22px",
              maxHeight: "calc(100vh - 280px)",
            }}
          >
            <ScrollArea style={{ paddingRight: "var(--mr-16)" }}>
              {navigationList.map((nav) => (
                <Sidebar.NavigationCell
                  key={nav.name}
                  href={nav.href}
                  leadingIcon={nav.leadingIcon}
                  active={nav.active}
                  disabled={nav.disabled}
                >
                  {nav.name}
                </Sidebar.NavigationCell>
              ))}
            </ScrollArea>
          </Sidebar.Navigations>
        </Flex>
        <Sidebar.Footer action={<DotsVerticalIcon />}>
          pyadav9678@gmail.com
        </Sidebar.Footer>
      </Sidebar>
      <Flex style={{ flex: 1, width: "100%", overflow: "hidden" }}>
        <Assets />
      </Flex>
    </Flex>
  );
};
