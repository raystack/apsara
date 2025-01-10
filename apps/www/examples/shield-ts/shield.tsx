import React, { useState } from "react";
import {
  ArrowRightIcon,
  DotsVerticalIcon,
  RocketIcon,
  HomeIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Flex } from "@raystack/apsara/v1";
import { Sidepanel } from "@raystack/apsara/v1";
import { Assets } from "./assets";

import "@raystack/apsara/style.css";

export const Shield = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Flex style={{ height: "100vh" }}>
        <Sidepanel.Root open={sidebarOpen} onOpenChange={setSidebarOpen} position="left">
          <Sidepanel.Header 
            logo={<HomeIcon width={24} height={24} />} 
            title="The North Face" 
          />
          <Sidepanel.Main>
            <Sidepanel.Item href="#" icon={<HomeIcon />} active>Explore</Sidepanel.Item>
            <Sidepanel.Item href="#" icon={<InfoCircledIcon />}>AOIs</Sidepanel.Item>
            <Sidepanel.Item href="#" icon={<InfoCircledIcon />}>Workflows</Sidepanel.Item>
            <Sidepanel.Item href="#" icon={<InfoCircledIcon />}>Marketplace</Sidepanel.Item>
            <Sidepanel.Item href="#" icon={<InfoCircledIcon />}>Activity</Sidepanel.Item>
          </Sidepanel.Main>
          <Sidepanel.Footer>
            <Sidepanel.Item href="#" icon={<InfoCircledIcon />}>Feedback</Sidepanel.Item>
            <Sidepanel.Item href="#" icon={<InfoCircledIcon />}>Support</Sidepanel.Item>
            <Sidepanel.Item href="#" icon={<InfoCircledIcon />}>Documentation</Sidepanel.Item>
            <Sidepanel.Item href="#" icon={<DotsVerticalIcon />}>
              john.doe@apsara.com
            </Sidepanel.Item>
          </Sidepanel.Footer>
        </Sidepanel.Root>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ 
            height: '24px',
            alignSelf: 'flex-start',
            margin: '16px 0',
            cursor: 'pointer',
            background: 'var(--rs-color-background-base-primary)',
            border: '1px solid var(--rs-color-border-base-primary)',
            borderRadius: 'var(--rs-radius-2)',
            padding: '4px 8px'
          }}
        >
          Toggle
        </button>
        <Flex style={{ flex: 1, width: "100%", overflow: "auto" }}>
          <Assets />
        </Flex>
      </Flex>
    </>
  );
};
