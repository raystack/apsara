import React, { useState } from "react";
import {
  DotsVerticalIcon,
  HomeIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Flex, Sidebar } from "@raystack/apsara/v1";
import { Assets } from "./assets";

import "@raystack/apsara/style.css";

export const Shield = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Flex style={{ height: "100vh" }}>
        <div style={{ position: 'relative' }}>
          <Sidebar.Root 
            open={sidebarOpen} 
            onOpenChange={setSidebarOpen} 
            position="left"
            profile={{
              icon: <DotsVerticalIcon />,
              label: "john.doe@apsara.com",
              href: "#"
            }}
          >
            <Sidebar.Header
              logo={<HomeIcon width={24} height={24} />} 
              title="The North Face" 
            />
            <Sidebar.Main>
              <Sidebar.Item href="#" icon={<HomeIcon />} active>Explore</Sidebar.Item>
              <Sidebar.Item href="#" icon={<InfoCircledIcon />}>AOIs</Sidebar.Item>
              <Sidebar.Item href="#" icon={<InfoCircledIcon />}>Workflows</Sidebar.Item>
              <Sidebar.Item href="#" icon={<InfoCircledIcon />}>Marketplace</Sidebar.Item>
              <Sidebar.Item href="#" icon={<InfoCircledIcon />}>Activity</Sidebar.Item>
            </Sidebar.Main>
            <Sidebar.Footer>
              <Sidebar.Item href="#" icon={<InfoCircledIcon />}>Feedback</Sidebar.Item>
              <Sidebar.Item href="#" icon={<InfoCircledIcon />}>Support</Sidebar.Item>
              <Sidebar.Item href="#" icon={<InfoCircledIcon />}>Documentation</Sidebar.Item>
            </Sidebar.Footer>
          </Sidebar.Root>
          
          {/* <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ 
              position: 'absolute',
              top: '16px',
              right: '-12px',
              height: '24px',
              cursor: 'pointer',
              background: 'var(--rs-color-background-base-primary)',
              border: '1px solid var(--rs-color-border-base-primary)',
              borderRadius: 'var(--rs-radius-2)',
              padding: '4px 8px',
              zIndex: 1
            }}
          >
             
          </button> */}
        </div>

        <Flex style={{ flex: 1, width: "100%", overflow: "auto" }}>
          <Assets />
        </Flex>
      </Flex>
    </>
  );
};
