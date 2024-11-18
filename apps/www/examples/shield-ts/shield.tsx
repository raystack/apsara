import React from "react";
import {
  DotsVerticalIcon
} from "@radix-ui/react-icons";

import { Flex, ScrollArea, Sidebar } from "@raystack/apsara";
import { Assets } from "./assets";
import { navigationList } from "./data";

import "@raystack/apsara/style.css";

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
          john.doe@apsara.com
        </Sidebar.Footer>
      </Sidebar>
      <Flex style={{ flex: 1, width: "100%", overflow: "auto" }}>
        <Assets />
      </Flex>
    </Flex>
  );
};
