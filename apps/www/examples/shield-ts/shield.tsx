import React from "react";
import {
  ArrowRightIcon,
  DotsVerticalIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { ScrollArea, Sidebar } from "@raystack/apsara";
import { Assets } from "./assets";
import { navigationList } from "./data";

import "@raystack/apsara/style.css";
import { AnnouncementBar, Flex } from "@raystack/apsara/v1";

export const Shield = () => {
  const router = useRouter();

  return (
    <>
      <AnnouncementBar
        variant="gradient"
        text="We have released new components with better theme support"
        leadingIcon={<RocketIcon />}
        actionLabel="checkout"
        actionIcon={<ArrowRightIcon />}
        onActionClick={() =>
          router.push("/docs/primitives/overview/introduction")
        }
      />
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
    </>
  );
};
